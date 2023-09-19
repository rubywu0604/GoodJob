# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
import re


class JobscraperPipeline:
    def process_item(self, item, spider):

        adapter = ItemAdapter(item)

        salary = adapter['min_monthly_salary']
        experience = adapter['experience']
        location = adapter['location']
        education = adapter['education']

        # normalize salary to monthly pay --> convert to int
        if salary != None:
            salary = salary.replace(',', '')
            max_pattern = re.search(r'(~|至)\s*(\d+)', salary)
            min_pattern = re.search(r'\s*(\d+)\s*(~|至)|(\d+)\s*(萬|元)', salary)

            if "以上" in salary:
                adapter['max_monthly_salary'] = "Above"
                if "萬" in salary:
                    adapter['min_monthly_salary'] = int("40000") if "四" in salary else int(min_pattern.group(3) + "0000")
                else:
                    adapter['min_monthly_salary'] = int(min_pattern.group(3)) if "月薪" in salary else int(min_pattern.group(3)) // 12

            else:
                if salary.startswith("月薪"):
                    adapter['max_monthly_salary'] = int(max_pattern.group(2))
                    adapter['min_monthly_salary'] = int(min_pattern.group(1))
                elif salary.startswith("年薪"):
                    adapter['max_monthly_salary'] = int(max_pattern.group(2)) // 12
                    adapter['min_monthly_salary'] = int(min_pattern.group(1)) // 12

        # set experience as year in int number
        adapter['experience'] = int(experience[0]) if experience[0].isdigit() else 0
        
        # clean location data
        adapter['location'] = location.replace('-', '')

        # format education
        education_list = {1: "不拘", 2: "高中", 3: "專科", 4: "大學", 5: "碩士"}
        for key, value in education_list.items():
            if value in education:
                adapter['education'] = value

        return item