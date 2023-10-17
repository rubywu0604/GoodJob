import scrapy
import re
import json
import requests
from bs4 import BeautifulSoup
from jobscraper.items import JobscraperItem


class A1111spiderSpider(scrapy.Spider):
    name = "1111spider"
    allowed_domains = ["www.1111.com.tw"]

    def start_requests(self):
        job_types = [
            "ios engineer", "android engineer", "frontend engineer 前端工程師", 
            "backend engineer 後端工程師", "data engineer 資料工程師", "data analyst 資料分析師", 
            "data scientist 資料科學家", "dba engineer 資料庫管理"
        ]
        for job_type in job_types:
            for p in range(1, 51):
                url = f"https://www.1111.com.tw/search/job?col=da&ks={job_type}&page={p}"
                yield scrapy.Request(url, callback=self.parse)

    def parse(self, response):
        jobs = response.css('.item__job')
        for job in jobs:
            category = re.search(r'ks=(\w+%20\w+)', response.url).group(1).replace("%20", "_")
            job_title = job.xpath('.//h5[@class="card-title title_6"]')
            job_title = job_title.xpath('string()').get()
            location = job.css('.job_item_info .job_item_detail a::text').get()
            company = job.css('.job_item_company::text').get()
            company = re.search(r'^(.*?) \|', company).group(1)
            salary = job.css('.job_item_detail_salary::text').get()
            education = job.css('.item_data .item_group .applicants::text').getall()[1][1::]
            experience = job.css('.item_data .item_group .applicants::text').getall()[0][1::]
            job_link = 'https://www.1111.com.tw' + job.css('.job_item_info a::attr(href)').get()

            category = self.categorize_job(job_title)

            yield scrapy.Request(
                job_link,
                callback=self.parse_1111_details,
                meta={
                    'category': category,
                    'job_title': job_title,
                    'location': location,
                    'company': company,
                    'salary': salary,
                    'education': education,
                    'experience': experience,
                    'job_link': job_link
                }
            )

    def parse_1111_details(self, response):
        job_link = response.url
        req = requests.get(job_link)
        soup = BeautifulSoup(req.text, 'html.parser')
        job_description = soup.text.lower()
        job_description_cleaned = re.sub(r'\s+', '', job_description)
        conditions = [
            "python", "ios", "swift", "android", "ruby", "c#", "c++", "php", "jquery", "aws",
            "typescript", "scala", "julia", "objective-c", "numpy", "pandas", "tensorflow", "gcp",
            "pytorch", "opencv", "react", "angular", "ruby on rails", ".net", "hibernate", "redis", 
            "express.js", "rubygems", ".net core", "django", "mysql", "ajax", "html", "css", "kotlin",
            "postgresql", "mongodb", "sqlite", "cassandra", "django", "express.js", "golang", "spark", 
            "flask", "react", "vue.js", "asp.net", "docker", "kubernetes", "flutter", "restful api",
            "azure", "ibm cloud", "node.js", "firebase", "airflow", "github","arduino", "power bi",
            "hadoop", "kafka", "elasticsearch", "tableau", "splunk", "scikit-learn", "javascript"
        ]

        java_pattern = re.search(r'(java)\W', job_description)
        special_case_java = java_pattern.group(1) if java_pattern else None

        skill_set = set()
        for condition in conditions:
            if condition in job_description_cleaned:
                skill_set.add(condition)
            elif special_case_java:
                skill_set.add(special_case_java)

        a1111Item = JobscraperItem()

        a1111Item['category'] = response.meta.get('category')
        a1111Item['job_title'] = response.meta.get('job_title')
        a1111Item['location'] = response.meta.get('location')
        a1111Item['company'] = response.meta.get('company')
        a1111Item['min_monthly_salary'] = response.meta.get('salary')
        a1111Item['max_monthly_salary'] = response.meta.get('salary')
        a1111Item['education'] = response.meta.get('education')
        a1111Item['experience'] = response.meta.get('experience')
        a1111Item['job_link'] = response.meta.get('job_link')
        a1111Item['skills'] = "Null" if skill_set == set() else list(skill_set)
        a1111Item['source_website'] = "1111人力銀行"

        yield a1111Item

    def categorize_job(self, job_title):
        job_title = job_title.lower()
        if "ios" in job_title or "flutter" in job_title or "swift" in job_title:
            return 'ios_engineer'
        elif "android" in job_title or "kotlin" in job_title:
            return 'android_engineer'
        elif "frontend" in job_title or "前端" in job_title or "網頁設計" in job_title or "ui" in job_title or "ux" in job_title:
            return 'frontend_engineer'
        elif "backend" in job_title or "後端" in job_title:
            return 'backend_engineer'
        elif "database" in job_title or "dba" in job_title or "資料庫" in job_title or "資料倉儲" in job_title:
            if "administrator" in job_title or "dba" in job_title or "管理" in job_title or "工程" in job_title:
                return 'dba'
        elif "data" in job_title or "資料" in job_title or "數據" in job_title:
            if "scientist" in job_title or "科學" in job_title:
                return 'data_scientist'
            elif "analyst" in job_title or "分析" in job_title:
                return 'data_analyst'
            elif "engineer" in job_title or "工程師" in job_title:
                return 'data_engineer'
        else:
            return "others"