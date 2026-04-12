-- =============================================================================
-- ClickHouse schema for behavioral analytics
-- Kafka Engine -> Materialized View -> ReplacingMergeTree (per event type)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- post_viewed
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS post_viewed_kafka (
    event_id        String,
    event_type      String,
    session_id      String,
    ip_hash         Nullable(String),
    country         Nullable(String),
    region          Nullable(String),
    city            Nullable(String),
    latitude        Nullable(Float32),
    longitude       Nullable(Float32),
    timestamp       String,
    app_version     String,
    post_slug       String,
    post_title      String,
    referrer        Nullable(String)
) ENGINE = Kafka
SETTINGS
    kafka_broker_list = 'kafka:9092',
    kafka_topic_list = 'site.post.viewed',
    kafka_group_name = 'analytics_consumer',
    kafka_format = 'JSONEachRow',
    kafka_num_consumers = 1;

CREATE TABLE IF NOT EXISTS post_viewed (
    event_id        String,
    event_type      String,
    session_id      String,
    ip_hash         Nullable(String),
    country         Nullable(String),
    region          Nullable(String),
    city            Nullable(String),
    latitude        Nullable(Float32),
    longitude       Nullable(Float32),
    timestamp       DateTime64(3) DEFAULT now64(),
    app_version     String,
    post_slug       String,
    post_title      String,
    referrer        Nullable(String)
) ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (post_slug, timestamp)
SETTINGS index_granularity = 8192;

CREATE MATERIALIZED VIEW IF NOT EXISTS post_viewed_mv TO post_viewed AS
SELECT
    event_id,
    event_type,
    session_id,
    ip_hash,
    country,
    region,
    city,
    latitude,
    longitude,
    parseDateTimeBestEffort(timestamp) AS timestamp,
    app_version,
    post_slug,
    post_title,
    referrer
FROM post_viewed_kafka;

-- -----------------------------------------------------------------------------
-- search_performed
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS search_performed_kafka (
    event_id        String,
    event_type      String,
    session_id      String,
    ip_hash         Nullable(String),
    country         Nullable(String),
    region          Nullable(String),
    city            Nullable(String),
    latitude        Nullable(Float32),
    longitude       Nullable(Float32),
    timestamp       String,
    app_version     String,
    query           String,
    result_count    UInt16
) ENGINE = Kafka
SETTINGS
    kafka_broker_list = 'kafka:9092',
    kafka_topic_list = 'site.search.performed',
    kafka_group_name = 'analytics_consumer',
    kafka_format = 'JSONEachRow',
    kafka_num_consumers = 1;

CREATE TABLE IF NOT EXISTS search_performed (
    event_id        String,
    event_type      String,
    session_id      String,
    ip_hash         Nullable(String),
    country         Nullable(String),
    region          Nullable(String),
    city            Nullable(String),
    latitude        Nullable(Float32),
    longitude       Nullable(Float32),
    timestamp       DateTime64(3) DEFAULT now64(),
    app_version     String,
    query           String,
    result_count    UInt16
) ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (query, timestamp)
SETTINGS index_granularity = 8192;

CREATE MATERIALIZED VIEW IF NOT EXISTS search_performed_mv TO search_performed AS
SELECT
    event_id,
    event_type,
    session_id,
    ip_hash,
    country,
    region,
    city,
    latitude,
    longitude,
    parseDateTimeBestEffort(timestamp) AS timestamp,
    app_version,
    query,
    result_count
FROM search_performed_kafka;

-- -----------------------------------------------------------------------------
-- similarity_clicked
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS similarity_clicked_kafka (
    event_id            String,
    event_type          String,
    session_id          String,
    ip_hash             Nullable(String),
    country             Nullable(String),
    region              Nullable(String),
    city                Nullable(String),
    latitude            Nullable(Float32),
    longitude           Nullable(Float32),
    timestamp           String,
    app_version         String,
    source_post_slug    String,
    clicked_post_slug   String,
    similarity_score    Nullable(Float32)
) ENGINE = Kafka
SETTINGS
    kafka_broker_list = 'kafka:9092',
    kafka_topic_list = 'site.similarity.clicked',
    kafka_group_name = 'analytics_consumer',
    kafka_format = 'JSONEachRow',
    kafka_num_consumers = 1;

CREATE TABLE IF NOT EXISTS similarity_clicked (
    event_id            String,
    event_type          String,
    session_id          String,
    ip_hash             Nullable(String),
    country             Nullable(String),
    region              Nullable(String),
    city                Nullable(String),
    latitude            Nullable(Float32),
    longitude           Nullable(Float32),
    timestamp           DateTime64(3) DEFAULT now64(),
    app_version         String,
    source_post_slug    String,
    clicked_post_slug   String,
    similarity_score    Nullable(Float32)
) ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (source_post_slug, clicked_post_slug, timestamp)
SETTINGS index_granularity = 8192;

CREATE MATERIALIZED VIEW IF NOT EXISTS similarity_clicked_mv TO similarity_clicked AS
SELECT
    event_id,
    event_type,
    session_id,
    ip_hash,
    country,
    region,
    city,
    latitude,
    longitude,
    parseDateTimeBestEffort(timestamp) AS timestamp,
    app_version,
    source_post_slug,
    clicked_post_slug,
    similarity_score
FROM similarity_clicked_kafka;

-- -----------------------------------------------------------------------------
-- post_created
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS post_created_kafka (
    event_id        String,
    event_type      String,
    session_id      String,
    ip_hash         Nullable(String),
    country         Nullable(String),
    region          Nullable(String),
    city            Nullable(String),
    latitude        Nullable(Float32),
    longitude       Nullable(Float32),
    timestamp       String,
    app_version     String,
    post_slug       String,
    post_title      String,
    tag_count       UInt8,
    has_embedding   UInt8
) ENGINE = Kafka
SETTINGS
    kafka_broker_list = 'kafka:9092',
    kafka_topic_list = 'site.post.created',
    kafka_group_name = 'analytics_consumer',
    kafka_format = 'JSONEachRow',
    kafka_num_consumers = 1;

CREATE TABLE IF NOT EXISTS post_created (
    event_id        String,
    event_type      String,
    session_id      String,
    ip_hash         Nullable(String),
    country         Nullable(String),
    region          Nullable(String),
    city            Nullable(String),
    latitude        Nullable(Float32),
    longitude       Nullable(Float32),
    timestamp       DateTime64(3) DEFAULT now64(),
    app_version     String,
    post_slug       String,
    post_title      String,
    tag_count       UInt8,
    has_embedding   UInt8
) ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (post_slug, timestamp)
SETTINGS index_granularity = 8192;

CREATE MATERIALIZED VIEW IF NOT EXISTS post_created_mv TO post_created AS
SELECT
    event_id,
    event_type,
    session_id,
    ip_hash,
    country,
    region,
    city,
    latitude,
    longitude,
    parseDateTimeBestEffort(timestamp) AS timestamp,
    app_version,
    post_slug,
    post_title,
    tag_count,
    has_embedding
FROM post_created_kafka;
