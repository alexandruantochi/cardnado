import requests
import json

counter = [0] * 10

for i in range(0, 500):
    data = json.loads(requests.get('https://cardnado-api.azurewebsites.net/api/getcard?store=tesco').text)
    counter[int(data['id'][-1])] += 1

print(counter)
