# This pipeline will add to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import re
import json
import logging
from itemadapter import ItemAdapter
from jobscraper.database import DatabaseRDS
from scrapy.exceptions import DropItem

class JobscraperPipeline:
    def __init__(self):
        self.db = DatabaseRDS()

    def _store_data_to_mysql(self, values):
        sql = """INSERT INTO job (
            category, company, education, experience, job_link, job_title,
            location, max_monthly_salary, min_monthly_salary, skills, source_website
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
        
        self.db.execute(sql, values)
        self.db.commit()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        if adapter['category'] == 'others':
            logging.info("Job is not in project scope. (Category: others)")
            raise DropItem(f"Drop 1 Item : {item}")
        salary = adapter['min_monthly_salary']
        experience = adapter['experience']
        location = adapter['location']
        education = adapter['education']

        # Normalize salary to monthly pay --> convert to int
        target_salary = ["面議", "~", "至", "年薪", "月薪"]
        for target in target_salary:
            if salary and salary.find(target) > -1:
                salary = salary.replace(',', '')
                max_pattern = re.search(r'(~|至)\s*(\d+)', salary)
                min_pattern = re.search(r'\s*(\d+)\s*(~|至)|(\d+)\s*(萬|元)', salary)

                if "以上" in salary:
                    adapter['max_monthly_salary'] = "Above"
                    if "萬" in salary:
                        adapter['min_monthly_salary'] = "40000" if "四" in salary else min_pattern.group(3) + "0000"
                    else:
                        adapter['min_monthly_salary'] = min_pattern.group(3) if "月薪" in salary else str(int(min_pattern.group(3)) // 12)
                else:
                    if salary.startswith("月薪"):
                        adapter['max_monthly_salary'] = max_pattern.group(2)
                        adapter['min_monthly_salary'] = min_pattern.group(1)
                    elif salary.startswith("年薪"):
                        if int(max_pattern.group(2)):
                            adapter['max_monthly_salary'] = str(int(max_pattern.group(2)) // 12)
                            adapter['min_monthly_salary'] = str(int(min_pattern.group(1)) // 12)
                        else:
                            adapter['min_monthly_salary'] = str(int(min_pattern.group(3)) // 12)
                            adapter['max_monthly_salary'] = adapter['min_monthly_salary']
                break

            else:
                adapter['max_monthly_salary'] = "Null"
                adapter['min_monthly_salary'] = "Null"

        # Set experience as year in int number
        adapter['experience'] = experience[0] if experience[0].isdigit() else 0

        # Clean location data
        adapter['location'] = location.replace('-', '')

        # Format education
        education_list = {1: "不拘", 2: "高中", 3: "專科", 4: "大學", 5: "碩士"}
        for key, value in education_list.items():
            if value in education:
                adapter['education'] = value

        items = (
            adapter['category'],
            adapter['company'],
            adapter['education'],
            adapter['experience'],
            adapter['job_link'],
            adapter['job_title'],
            adapter['location'],
            adapter['max_monthly_salary'],
            adapter['min_monthly_salary'],
            str(adapter['skills']),
            adapter['source_website']
        )

        self._store_data_to_mysql(items)

        if ("ios" in adapter['job_title'] and "android" in adapter['job_title']) or "flutter" in adapter['job_title']:
            adapter['category'] = 'android_engineer'
            copy_items = (
                adapter['category'],
                adapter['company'],
                adapter['education'],
                adapter['experience'],
                adapter['job_link'],
                adapter['job_title'],
                adapter['location'],
                adapter['max_monthly_salary'],
                adapter['min_monthly_salary'],
                str(adapter['skills']),
                adapter['source_website']
            )
            self._store_data_to_mysql(copy_items)
            
        return item