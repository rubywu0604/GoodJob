import scrapy
import re
import json
import requests
from bs4 import BeautifulSoup
from jobscraper.items import JobscraperItem


class A104spiderSpider(scrapy.Spider):
    name = "104spider"
    allowed_domains = ["www.104.com.tw"]

    def start_requests(self):
        job_types = [
            "ios_engineer_工程師", "android_engineer_工程師", "frontend_engineer_前端工程師", 
            "backend_engineer_後端工程師", "data_engineer_資料工程師", "data_analyst_資料分析師", 
            "data_scientist_資料科學家", "dba_資料庫管理"
        ]
        for job_type in job_types:
            for p in range(1, 21):
                url = f"https://www.104.com.tw/jobs/search/?keyword={job_type}&page={p}"
                yield scrapy.Request(url, callback=self.parse)

    def parse(self, response):
        jobs = response.css('article.job-list-item')
        for job in jobs:
            lastupdate = job.css('h2 span.b-tit__date::text').get().strip()
            if "/" in lastupdate:
                category = re.search(r'keyword=(\w+)_', response.url).group(1)
                job_title = job.css('h2 a::text, h2 em::text').getall()
                job_title = ''.join(job_title).strip()
                location = job.css('ul.job-list-intro li:nth-child(1)::text').get()
                company = job.css('li:nth-child(2) a::text').get().strip().replace('\n', '')
                salary = job.css('div.job-list-tag a:nth-child(1)::text').get()
                education = job.css('ul.job-list-intro li:nth-child(5)::text').get()
                experience = job.css('ul.job-list-intro li:nth-child(3)::text').get()
                job_link = 'https:' + job.css('h2 a::attr(href)').get()
                yield scrapy.Request(
                    job_link,
                    callback=self.parse_104_details,
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

    def parse_104_details(self, response):
        job_link = response.url
        req = requests.get(job_link)
        soup = BeautifulSoup(req.text, 'html.parser')
        text_ = json.loads("".join(soup.find("script", {"type":"application/ld+json"}).contents))
        job_description = soup.text.lower()
        conditions = [
            "python", "java", "javascript", "ruby", "c#", "c++", "php", "swift", "kotlin", "golang", 
            "rust", "typescript", "matlab", "perl", "scala", "dart", "lua", "julia", "objective-c",
            "numpy", "pandas", "tensorflow", "scikit-learn", "keras", "pytorch", "opencv", "react", 
            "angular", "vue.js", "ruby on rails", ".net framework", "hibernate", "spring framework", 
            "qt", "express.js", "rubygems", ".net core", "django", "mysql", "ajax", "html", "css",
            "postgresql", "mongodb", "oracle database", "microsoft sql server", "sqlite", "redis", 
            "cassandra", "couchbase", "amazon dynamodb", "ruby on rails", "django", "express.js", 
            "laravel (php)", "flask", "react", "vue.js", "asp.net", "spring boot", "git", "svn", 
            "mercurial", "cvs", "perforce", "tfs (team foundation server)", "aws", "particle",
            "docker", "kubernetes", "jenkins", "ansible", "puppet", "chef", "terraform", "vagrant", 
            "nagios", "microsoft azure", "gcp", "ibm cloud", "oracle cloud", "node.js", "firebase",
            "hadoop", "spark", "hive", "pig", "kafka", "elasticsearch", "tableau", "splunk", "power bi",
            "android", "kotlin", "ios", "swift", "flutter", "xamarin", "phonegap/cordova","arduino", 
            "raspberry pi", "mqtt", "node-red", "tinkercad", "airflow", "github"
        ]

        skill_set = set()
        for condition in conditions:
            if condition in job_description:
                skill_set.add(condition)
        
        a104Item = JobscraperItem()

        a104Item['category'] = response.meta.get('category')
        a104Item['job_title'] = response.meta.get('job_title')
        a104Item['location'] = response.meta.get('location')
        a104Item['company'] = response.meta.get('company')
        a104Item['min_monthly_salary'] = response.meta.get('salary')
        a104Item['max_monthly_salary'] = response.meta.get('salary')
        a104Item['education'] = response.meta.get('education')
        a104Item['experience'] = response.meta.get('experience')
        a104Item['job_link'] = response.meta.get('job_link')
        a104Item['skills'] = "Null" if skill_set == set() else list(skill_set)
        a104Item['source_website'] = "104人力銀行"
        
        yield a104Item