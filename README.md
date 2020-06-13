# Fatal Encounters API


A simple API to access the [Fatal Encounters](https://fatalencounters.org/) database. See [this](https://docs.google.com/spreadsheets/d/1dKmaV_JiWcG8XBoRgP8b4e9Eopkpgt7FL7nyspvzAsE/edit#gid=0) Google Spreadsheet for more information on the data and what it provides.

Instead of having to download the dataset as a large csv file, you can query results based on year, race, cause, gender, state, and age. The data is also updated daily from the webpage, which may be useful for up-to-date, interactive visualizations.

Feel free to make suggestions/contributions: open source!

## Getting Data

Endpoint URL: https://fatalencounters.now.sh/api

### Simple Usage

Make a **POST** request to the endpoint to get the JSON data. This should return the following:

```json
{
	"result":{{result 1}, {result 2}, ...}, 
	"next": "XXXXXXXXXXXXXXXXXXXXXXXX"
}
```
Note: Results are paginated and the max response size is 1000 results. The JSON response includes a `next` value that can be used in the subsequent request to get data.

### Make a Filtered Search

To make a filtered search, simply include a JSON search query in the request body. You can search the data with any combination of the following attributes:

 - Age
 - Year of Incident
 - Race
 - Cause
 - Gender
 - State

For age and year of accident, you can either provide a single value or a JSON object with a value for the `start` key specifying the lower bound, and one for the `end` key specifying the upper bound. For the rest of the attributes you can either provide a single value, or an array containing multiple values. 

#### Age

Example:
```python
#single age
payload = {
	"age": 25
}

#age range
payload = {
	"age": {"start":20, "end":30}
}
```

#### Year of Incident
Dataset spans from 2000 to current year.

Example:
```python
#single year
payload = {
	"year": 2020
}

#year range
payload = {
	"age": {"start":2015, "end":2017}
}
```

#### Race
The following races are included in the dataset:

- `African-American/Black`
- `European-American/White`
- `Hispanic/Latino`
- `Native American/Alaskan`
- `Asian/Pacific Islander`
- `Middle Eastern`

Example:
```python
#single race
payload = {
	"race": "Middle Eastern"
}
#multiple races
payload = {
	"race": ["Middle Eastern", "African-American/Black"]
}
```
#### Cause

The following causes are included in the dataset:

- `Vehicle`
- `Gunshot`
- `Beaten/Bludgeoned with instrument`
- `Stabbed`
- `Asphyxiated/Restrained`
- `Drowned`
- `Drug overdose`
- `Fell from a height`
- `Undetermined`
- `Chemical agent/Pepper spray`
- `Medical emergency`
- `Burned/Smoke inhalation`
- `Tasered`
- `Other`
- `Unknown`

Example:
```python
#singe cause
payload = {
	"cause": "Fell from a height"
}

#multiple causes
payload = {
	"cause": ["Fell from a height", "Gunshot", "Vehicle"]
}
```

#### Gender

The following genders are included in the dataset:

- Female
- Transgender
- Male
- Transexual

Example:
```python
#single genders
payload = {
	"gender": "Male"
}

#multiple genders
payload = {
	"gender": ["Male","Transgender"]
}
```

#### State
Uses the two letter abbreviation (ie. `CA`, `AZ`, etc.) of all the 50 states of the US.

Example:
```python
#single genders
payload = {
	"state": "AK"
}

#multiple genders
payload = {
	"state": ["NH","FL"]
}
```

### Pagination

If a search returns more than 1000 results, the data will become paginated. There will be a `next` key in the first response:
```python
{
	"result":{{result 1}, {result 2}, ... result 1000}, 
	"next": "ABCDXXXXXXXXXXXXXXXX1234"
}
```
You can include in the next request to get the second page.
```python
payload = {
	"next": "ABCDXXXXXXXXXXXXXXXX1234"
}
```
If you want all the results, you can repeat this process until you get all the data.

### Code Sample: Get All Pages

Python Code:
```python
import requests

#query parameters
payload = {
	'state':['CA']
} 

continueStatus =  True
allData = []

#Loop to go through all pages
while continueStatus:
	x = requests.post('https://fatalencounters.now.sh/api', json=payload).json()
	allData += x['result']

	#specify the next page object for each request if it exists
	#else stop the loop

	if 'next' in x:
		payload['next'] = x['next']
	else:
		continueStatus=False
```


## Contribution

Feel free to drop a PR, leave a suggestion, or say hello!
