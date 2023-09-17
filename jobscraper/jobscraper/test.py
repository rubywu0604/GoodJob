start_urls = []

job_types = [
    "ios",
    "android",
    "frontend",
    "backend",
    "data engineer",
    "data analyst",
    "data scientist",
    "dba"
]
for job_type in job_types:
    for p in range(1, 11):
        url = f"https://www.104.com.tw/jobs/search/?keyword={job_type}&page={p}"
        start_urls.append(url)
print(start_urls, len(start_urls))