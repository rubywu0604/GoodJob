import scrapy
import re
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import unquote
from jobscraper.items import JobscraperItem
from jobscraper.database import DatabaseRDS


class A518spiderSpider(scrapy.Spider):
    name = "518spider"
    allowed_domains = ["www.518.com.tw"]

    def start_requests(self):
        db = DatabaseRDS()
        db.delete()
        db.reset_auto_increment()
        job_types = [
            "軟體工程師", "前端工程師", "後端工程師", "資料工程師", 
            "資料分析師", "資料科學家", "資料庫管理"
        ]
        for job_type in job_types:
            for p in range(1, 11):
                url = f"https://www.518.com.tw/job-index-P-{p}.html?ad={job_type}"
                yield scrapy.Request(url, callback=self.parse)
    
    def parse(self, response):
        result = response.css('section.job-content .findmsg p::text').get()
        if result != "抱歉沒有搜到適合的職缺":
            jobs = response.css('section.job-content')
            for job in jobs:
                category_code = re.search(r'ad=(.+)', response.url).group(1)
                category = unquote(category_code)
                job_title = job.css('h2 a.job__title::text').get()
                company = job.css('span.job__comp__name::text').get()
                salary = job.css('p.job__salary::text').get()
                location = job.css('ul.job__summaries li:nth-child(1)::text').get()
                experience = job.css('ul.job__summaries li:nth-child(2)::text').get()
                education = job.css('ul.job__summaries li:nth-child(3)::text').get()
                job_link = job.css('h2 a::attr(href)').get()
                yield scrapy.Request(
                    job_link,
                    callback=self.parse_518_details,
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
    
    def parse_518_details(self, response):
        job_link = response.url
        req = requests.get(job_link)
        soup = BeautifulSoup(req.text, 'html.parser')
        job_description = soup.text.lower()
        job_description_cleaned = re.sub(r'\s+', '', job_description)
        conditions = [
            "python", "ios", "swift", "android", " java ", " javascript ", "ruby", "c#", "c++", "php",
            "typescript", "scala", "julia", "objective-c", "numpy", "pandas", "tensorflow", "scikit-learn",
            "pytorch", "opencv", "react", "angular", "ruby on rails", ".net", "hibernate", " java,"," javascript/",           
            "express.js", "rubygems", ".net core", "django", "mysql", "ajax", "html", "css", "kotlin", "git",
            "postgresql", "mongodb", "sqlite", "redis", "cassandra", "django", "express.js", "golang", "aws",
            "flask", "react", "vue.js", "asp.net", "docker", "kubernetes", "flutter", " javascript,", "gcp", 
            "azure", "ibm cloud", "node.js", "firebase", "airflow", "github","arduino", "java/", "restful api",
            "hadoop", "spark", "kafka", "elasticsearch", "tableau", "splunk", "power bi", "jquery"        
        ]

        skill_set = set()
        for condition in conditions:
            if condition in job_description_cleaned:
                skill_set.add(condition)

        a518Item = JobscraperItem()

        a518Item['category'] = response.meta.get('category')
        a518Item['job_title'] = response.meta.get('job_title')
        a518Item['location'] = response.meta.get('location')
        a518Item['company'] = response.meta.get('company')
        a518Item['min_monthly_salary'] = response.meta.get('salary')
        a518Item['max_monthly_salary'] = response.meta.get('salary')
        a518Item['education'] = response.meta.get('education')
        a518Item['experience'] = response.meta.get('experience')
        a518Item['job_link'] = response.meta.get('job_link')
        a518Item['skills'] = "Null" if skill_set == set() else list(skill_set)
        a518Item['source_website'] = "518熊班"

        yield a518Item