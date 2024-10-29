import pytz

broker_url="redis://localhost:6379/1"
result_backend = "redis://localhost:6379/2"

broker_connection_retry_on_startup = True
timezone = pytz.timezone("Asia/Kolkata")