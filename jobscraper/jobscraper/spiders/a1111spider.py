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
            "ios_engineer_工程師", "android_engineer_工程師", "frontend_engineer_前端工程師", 
            "backend_engineer_後端工程師", "data_engineer_資料工程師", "data_analyst_資料分析師", 
            "data_scientist_資料科學家", "dba_資料庫管理"
        ]
        for job_type in job_types:
            for p in range(1, 21):
                url = f"https://www.1111.com.tw/search/job?col=da&ks={job_type}&page={p}"
                yield scrapy.Request(url, callback=self.parse)

    def parse(self, response):
        jobs = response.css('.item__job')
        for job in jobs:
            category = re.search(r'ks=(\w+)_', response.url).group(1)
            job_title = job.xpath('.//h5[@class="card-title title_6"]')
            job_title = job_title.xpath('string()').get()
            location = job.css('.job_item_info .job_item_detail a::text').get()
            company = job.css('.job_item_company::text').get()
            company = re.search(r'^(.*?) \|', company).group(1)
            salary = job.css('.job_item_detail_salary::text').get()
            education = job.css('.item_data .item_group .applicants::text').getall()[1][1::]
            experience = job.css('.item_data .item_group .applicants::text').getall()[0][1::]
            job_link = 'https://www.1111.com.tw' + job.css('.job_item_info a::attr(href)').get()
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
        a1111Item['skills'] = list(skill_set)
        a1111Item['source_website'] = "1111人力銀行"

        yield a1111Item