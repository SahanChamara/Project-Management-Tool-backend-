import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score

data = {
    'title':[
        "Finish ER Diagram",
        "Code Task Manager	",
        "Design UI",
        "Write Documentation",
        "Test API Endpoints",
        "Deploy to Server",
        "Database Optimization",
        "Fix UI Bugs",
        "Create User Accounts",
        "Update README",
    ],
    'description':[
        "Design ER diagram for project",
        "Implement backend API",
        "Create wireframes for UI",
        "Prepare user manual",
        "Perform API testing",
        "Host the application online",
        "Optimize SQL queries",
        "Resolve UI/UX issues",
        "Set up initial user accounts",
        "Improve project documentation",
    ],
    'days_until_deadline':[1,5,3,6,3,0,0,8,6,4],
    'completion_time':[120,60,40,30,45,60,135,120,40,30],
    'priority_level':['High','High','Medium','Low','Medium','High','High','Medium','Low','Low']  
}

df = pd.DataFrame(data)

priority_mapping = {'Low':0,'Medium':1,'High':2}
df['priority_level'] = df['priority_level'].map(priority_mapping)

X = df[['title','description','days_until_deadline','completion_time']]
y = df['priority_level']

text_vectorizer = TfidfVectorizer(stop_words='english')

model = Pipeline([
    ('tfidf',text_vectorizer),
    ('classifier',RandomForestClassifier(n_estimators=100,random_state=42))
])

X['text_combined'] = X['title']+" "+X['description']
X_train,X_test,y_train,y_test = train_test_split(X['text_combined'],y,test_size=0.2,random_state=42)

model.fit(X_train,y_train)


title = 'Debug Payment System'
desc = 'Fix payment gateway issues'

new_task = [title+ " - " +desc]
predict = model.predict(new_task)

print(predict)

prLevel = {0:'Low',1:'Medium',2:'High'}
predictWithLabel = prLevel[predict[0]]

print("Prediction: ",predictWithLabel)
