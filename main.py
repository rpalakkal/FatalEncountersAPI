import pandas as pd
import numpy as np
import pymongo
from dotenv import load_dotenv
import os

load_dotenv()

db_url = os.getenv("url")


df = pd.read_csv('https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/export?format=csv&id=1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE&gid=0')

#df = pd.read_csv('data.csv')

#Data cleanup
columns_to_remove = [
'Dispositions/Exclusions INTERNAL USE, NOT FOR ANALYSIS', 
'Symptoms of mental illness? INTERNAL USE, NOT FOR ANALYSIS',
'Video', 
'Date&Description', 
'Unique ID formula', 
'Unique identifier (redundant)',
]

df.drop(columns_to_remove, inplace=True, axis=1)

renameColumns = ['uid', "name", "age", 'gender', "race", "raceImputed", 'raceProb', 'imageURL', 'incidentDate', 'streetAddress', 'city', 'state', 'zipCode', 'county', 'fullAddress', 'lat', 'lng', 'policeAgency', 'cause', 'description', 'intentionalUse', 'source', 'year']

df.set_axis(renameColumns, inplace=True, axis=1)

df['raceProb'].replace({'not imputed': np.nan, 'Race unspecified': np.nan, 'HIspanic/Latino':"Hispanic/Latino", 'race not determined':np.nan}, inplace=True)
df['race'].replace({'Race unspecified': np.nan, 'race not determined':np.nan, 'HIspanic/Latino':"Hispanic/Latino"}, inplace=True)
df['raceImputed'].replace({'Race unspecified': np.nan, 'HIspanic/Latino':"Hispanic/Latino", "European American/White":"European-American/White"}, inplace=True)

df['gender'].replace({'White': np.nan}, inplace=True)

df.loc[~pd.isnull(df['race']), "raceProb" ] = 1

df['uid'] = df['uid'].apply(pd.to_numeric, errors='coerce')
df.dropna(subset=['uid'], inplace=True)
df['age'] = df['age'].apply(pd.to_numeric, errors='coerce')
df['year'] = df['year'].apply(pd.to_numeric, errors='coerce')

data_dict = df.to_dict('records')
print(df['intentionalUse'].unique())

#upload to mongodb
try:
    client = pymongo.MongoClient(db_url)

    db = client['fatalencounters']
    db['main'].rename('backup')
    db['main'].insert_many(data_dict)
    db['backup'].drop()
except:
    db['backup'].rename('main')
    print('Error')




