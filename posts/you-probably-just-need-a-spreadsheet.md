---
title: "You (Probably) Just Need a Spreadsheet"
hook: "It's a tired expression, but no matter how far you make it any field or career, it's a simple reality: you end up spending more time in spreadsheets than anywhere else."
slug: you-probably-just-need-a-spreadsheet
created_at: 2024-12-22T09:30:00.000Z
image: /static/images/spreadsheet.png
---
 
# You (Probably) Just Need a Spreadsheet

## Overview

As developers, we love a database for storing information. But, the reality is, this isn't always the tool you should reach for when building out a service. Why? You have to think of the end user and how the service will be used on a daily basis; you have to think about the problem you're solving.

Recently, we started work at [Hasura](https://hasura.io) to improve our community response rate across various services: GitHub issues, discussions, and Discord threads. Truth be told, we've been engaged in this work for quite a while; our efforts recently have focused on involving more of our engineers and ensuring the loop is closed with each user so they're unblocked. The added benefits of getting engineering teams involved is two-fold:

- We get the builders of the feature (who have the greatest knowledge of its mechanics) helping users directly.
- In turn, these engineers get feedback from users and can take that back to their work as they improve the product.

Ultimately, this is a bureaucratic task. That word can be discomforting: **bureaucratic**. It evokes connotations of red tape, needless hoops to jump through, and unnecessarily rigid procedures. Maybe a better word choice is **administrative**? These tasks, while not in the least bit sexy, are wholly required to ensure goals are met and that users get the care and attention they need.

Do you know what an administrator (or a bureaucrat) loves? The answer isn't a DB...it's a spreadsheet.

## The Repo

I built [this repo](https://github.com/hasura/docs-community-tracker) out a few evenings back. As the README says, the process begins by fetching new issues and discussions from the specified [`hasura` GitHub repositories](https://github.com/hasura/docs-community-tracker/blob/main/src/constants.ts#L1-L3). Simultaneously, it retrieves new threads from [selected channels in Discord](https://github.com/hasura/docs-community-tracker/blob/main/src/constants.ts#L7-L9). Once the data is gathered, the body of each issue or discussion is parsed through an OpenAI model to generate a succinct summary. Finally, an ETL job is performed using a service account to log all this information into a spreadsheet accessible to everyone in the organization.

## The Sheets API

Instead of writing all this information to a DB, we're storing it in a Google Sheet using a service account to access the API. Would a nice UI styled up with Tailwind be great? Sure. Would it be great to vectorize this data and be able to perform semantic searches on it? You bet. Is that required to ship this and start better assisting our users?

![Absolutely not](https://i.giphy.com/M8x6Lk2QFmTu0.webp)

Like any Google service, you'll need a [project](https://cloud.google.com/storage/docs/projects) and to enable certain API permissions on it. This is relatively straightforward. However, for the first time, I used a Google [service account](https://cloud.google.com/iam/docs/service-account-overview) to act on its own instead of on behalf of a user (me).

After creating the service account, I downloaded a credentials file in JSON, encoded it in base64, and set it as an environment variable in my `.env`; then I could access it like this in the module's configuration:

```ts
export const authenticateGoogleSheets = async (): Promise<sheets_v4.Sheets> => {
  const encodedCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

  if (!encodedCredentials) {
    throw new Error(
      "Environment variable GOOGLE_SERVICE_ACCOUNT_CREDENTIALS is not set",
    );
  }

  const credentials = JSON.parse(
    Buffer.from(encodedCredentials, "base64").toString("utf8"),
  );

  const authClient = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  // Authenticate and initialize Sheets API
  const sheets = google.sheets({ version: "v4", auth: authClient });
  return sheets;
};
```

Then, in the module, I can call the client and write a newly-shaped row from any community service like this, inserting it to the spreadsheet:

```ts
export async function writeNewRow(row: SheetRow): Promise<void> {
  const sheets = await authenticateGoogleSheets();

  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = "Sheet1";

  // Nice little addition the clears crap out of the way so we write to the correct row(s)
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: "Sheet1!G:ZZ",
  });

  const newRow = [row.link, row.createdAt, row.notes, row.outcome, row.status];

  // Append the new row to the sheet
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [newRow],
    },
  });

  console.log("New row added:", newRow);
}
```

## The Benefits

We run this hourly using a [GitHub Action](https://github.com/hasura/docs-community-tracker/blob/main/.github/workflows/check-for-updates.yml). Initially, another engineer and I were responsible for checking these various sources twice per day; however, we've moved to (thankfully) having one person responsible for overseeing and orchestrating the tasks associated with each new user ask while we act on new asks when we can. 

Now, we run this hourly so we can hop in whenever there's some free time and check to see if there's anything we can quickly unblock or delegate out to the appropriate engineering team.

We each had different ways of keeping up with new asks, but there wasn't a uniform way of ensuring both that we were meeting our commitments and that nothing was slipping through the cracks. We utilized a third-party SaaS that (while capable of much more) **we were essentially paying $15,000 per year for lagging indicators** of what had been taken care of and which team(s) had followed up with the user.

Now, this spreadsheet works as our single source of truth easily enabling all of us to see:

- What's come through (summarized by ChatGPT, because...users aren't the most direct when they're confused)
- If it's been acted on
- Its state (open || closed)
- A quick link out to access the source immediately

## Closing

At the end of the day, the simplest solution is often the best. Spreadsheets are not the most glamorous tool, but they are ubiquitous, easy to share, and incredibly flexible for many administrative tasks. By choosing a spreadsheet over a database or a custom-built app, we avoided unnecessary complexity, saved time, and delivered a solution that immediately met our needs. 

Sure, we could have opted for a sophisticated UI, a complex backend, or integration with some shiny SaaS product—but none of that was necessary to achieve our goal. Our team needed a single source of truth that was easy to use, easy to maintain, and could start providing value right away. The spreadsheet delivered exactly that.

So, next time you're staring down a new project, ask yourself: "Am I choosing the right tool for the job, or am I overcomplicating the solution?" Sometimes, the simplest choice is the most effective one—and it might just save you and your team a lot of time, effort, and resources.
