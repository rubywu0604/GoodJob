const chai = require('chai');
const script = require('../views/static/script');
const expect = chai.expect;


const data = [{
        'id': 1,
        'category': 'frontend_engineer',
        'job_title': '【固得租車】VUE 前端工程師',
        'location': '新北市三重區',
        'company': '固得租車(東利租賃有限公司)',
        'min_monthly_salary': '40000',
        'max_monthly_salary': '60000',
        'education': '大學',
        'skills': '["css", "jquery", "html", "javascript"]',
        'experience': 0,
        'job_link': 'https://www.518.com.tw/job-NAY0Zk.html',
        'source_website': '518熊班'
    },
    {
        'id': 2,
        'category': 'backend_engineer',
        'job_title': '後端工程師',
        'location': '新北市林口區',
        'company': '東利租賃有限公司',
        'min_monthly_salary': '40000',
        'max_monthly_salary': 'Above',
        'education': '大學',
        'skills': '["javascript"]',
        'experience': 2,
        'job_link': 'https://www.518.com.tw/job-UYH9IN.html',
        'source_website': '104人力銀行'
    },
    {
        'id': 3,
        'category': 'ios_engineer',
        'job_title': 'IOS工程師',
        'location': '台北市南港區',
        'company': '客遊天下有限公司',
        'min_monthly_salary': '60000',
        'max_monthly_salary': '133333',
        'education': '碩士',
        'skills': '["ios", "flutter"]',
        'experience': 5,
        'job_link': 'https://www.518.com.tw/job-UBSO5T.html',
        'source_website': '1111人力銀行'
    }
];

const expectedSkillCounts = {
    'css': 1,
    'airflow': 1,
    'javascript': 1,
    'c++': 1,
    'python': 1,
    'mysql': 1,
    'postgresql': 1,
};

const dataByCategory = [
    {
        "id": 256,
        "category": "data_engineer",
        "job_title": "Senior Data Engineer_先進資訊架構部(台北)",
        "location": "台北市內湖區",
        "company": "台達電子工業股份有限公司",
        "min_monthly_salary": "40000",
        "max_monthly_salary": "Above",
        "education": "大學",
        "skills": "['css', 'airflow', 'javascript']",
        "experience": 3,
        "job_link": "https://www.1111.com.tw/job/103816156/",
        "source_website": "1111人力銀行"
    },
    {
        "id": 264,
        "category": "data_engineer",
        "job_title": "大數據資料處理工程師_知名軟體公司 (3006613)",
        "location": "台北市中山區",
        "company": "(獵頭)Accurate愛客獵股份有限公司(1111 高階獵才)",
        "min_monthly_salary": "40000",
        "max_monthly_salary": "Above",
        "education": "不拘",
        "skills": "['c++', 'python', 'javascript']",
        "experience": 0,
        "job_link": "https://www.1111.com.tw/job/98873308/",
        "source_website": "1111人力銀行"
    },
    {
        "id": 267,
        "category": "data_engineer",
        "job_title": "資料工程師_某知名公司 (3006985)",
        "location": "台北市松山區",
        "company": "(獵頭)Accurate愛客獵股份有限公司(1111 高階獵才)",
        "min_monthly_salary": "40000",
        "max_monthly_salary": "Above",
        "education": "不拘",
        "skills": "['mysql', 'postgresql', 'airflow', 'javascript']",
        "experience": 0,
        "job_link": "https://www.1111.com.tw/job/99032872/",
        "source_website": "1111人力銀行"
    }
];

const jobDetails = {
    'iOS Engineer': {
        'counts': 1,
        'aryMaxSalary': [133333],
        'aryMinSalary': [60000],
        'avgMaxSalary': 133333,
        'avgMinSalary': 60000
    },
    'Android Engineer': {
        'aryMaxSalary': [],
        'aryMinSalary': [],
        'avgMaxSalary': NaN,
        'avgMinSalary': NaN,
        'counts': 0
    },
    'Frontend Engineer': {
        'counts': 1,
        'avgMinSalary': 40000,
        'avgMaxSalary': 60000,
        'aryMinSalary': [40000],
        'aryMaxSalary': [60000]
    },
    'Backend Engineer': {
        'counts': 1,
        'avgMinSalary': 40000,
        'avgMaxSalary': NaN,
        'aryMinSalary': [40000],
        'aryMaxSalary': []
    },
    'Data Analyst': {
        'aryMaxSalary': [],
        'aryMinSalary': [],
        'avgMaxSalary': NaN,
        'avgMinSalary': NaN,
        'counts': 0,
    },
    'Data Engineer': {
        'aryMaxSalary': [],
        'aryMinSalary': [],
        'avgMaxSalary': NaN,
        'avgMinSalary': NaN,
        'counts': 0,
    },
    'Data Scientist': {
        'aryMaxSalary': [],
        'aryMinSalary': [],
        'avgMaxSalary': NaN,
        'avgMinSalary': NaN,
        'counts': 0
    },
    'DBA': {
        'aryMaxSalary': [],
        'aryMinSalary': [],
        'avgMaxSalary': NaN,
        'avgMinSalary': NaN,
        'counts': 0
    },
};

const experienceCounts = {
    '不拘': 1,
    '2年': 1,
    '5年': 1
};

describe('processData', () => {
    it('Should process data to return jobDetails and experienceCounts.', () => {
        expect(script.processData(data)).to.deep.equal({ jobDetails, experienceCounts });
    });
});

describe('formatCategory', () => {
    it('Should format category name correctly.', () => {
        expect(script.formatCategory('ios_engineer')).to.deep.equal('iOS Engineer');
        expect(script.formatCategory('dba')).to.deep.equal('DBA');
        expect(script.formatCategory('backend_engineer')).to.deep.equal('Backend Engineer');
    });
});

describe('formatExperience', () => {
    it('Should format experience correctly.', () => {
        expect(script.formatExperience(0)).to.deep.equal('不拘');
        expect(script.formatExperience(1)).to.deep.equal('1年');
        expect(script.formatExperience(5)).to.deep.equal('5年');
    });
});

describe('calAvgSalaries', () => {
    it('Should calculate average salary.', () => {
        const jobDetailsCopy = { ...jobDetails };
        script.calAvgSalaries(jobDetailsCopy);
        expect(jobDetailsCopy['iOS Engineer'].avgMinSalary).to.equal(60000);
        expect(jobDetailsCopy['iOS Engineer'].avgMaxSalary).to.equal(133333);
        expect(jobDetailsCopy['Frontend Engineer'].avgMinSalary).to.equal(40000);
    });
});

describe('calAvgSalaryByCategory', () => {
    it('Should calculate average salary for a single monthly salary.', () => {
        const monthlyAvgSalary = [50000];
        script.calAvgSalaryByCategory(30000, 50000, monthlyAvgSalary);
        expect(monthlyAvgSalary).to.deep.equal([50000, 40000]);
    });
    it('Should calculate average salary for multiple monthly salaries.', () => {
        const monthlyAvgSalary = [50000, 40000];
        script.calAvgSalaryByCategory(100000, 120000, monthlyAvgSalary);
        expect(monthlyAvgSalary).to.deep.equal([50000, 40000, 110000]);
    });
});

describe('calAnnualAvgSalary', () => {
    it('Should calculate annual average salary for a single monthly salary.', () => {
        const monthlyAvgSalary = [50000];
        const annualAvg = script.calAnnualAvgSalary(monthlyAvgSalary);
        expect(annualAvg).to.equal(650000);
    });

    it('Should calculate annual average salary for multiple monthly salaries.', () => {
        const monthlyAvgSalary = [50000, 40000];
        const annualAvg = script.calAnnualAvgSalary(monthlyAvgSalary);
        expect(annualAvg).to.equal(585000);
    });
});

describe('countSkillsByCategory', () => {
    it('Should count the appearance of skill', () => {
        const skillCounts = {};
        const skillsA = "['python', 'hadoop', 'java']";
        const skillsB = "['postgresql', 'java']";
        expect(script.countSkillsByCategory(skillsA, skillCounts)).to.deep.equal({ 'python': 1, 'hadoop': 1, 'java': 1 });
        expect(script.countSkillsByCategory(skillsB, skillCounts)).to.deep.equal({ 'python': 1, 'hadoop': 1, 'java': 2, 'postgresql': 1 });
    });
});


describe('countEducationByCategory', () => {
    it('Should count the appearance of education.', () => {
        const educationCounts = {};
        expect(script.countEducationByCategory('大學', educationCounts)).to.deep.equal({ '大學': 1 });
        expect(script.countEducationByCategory('不拘', educationCounts)).to.deep.equal({ '大學': 1, '不拘': 1 });
        expect(script.countEducationByCategory('大學', educationCounts)).to.deep.equal({ '大學': 2, '不拘': 1 });
    });
});