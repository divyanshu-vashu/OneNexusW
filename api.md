### register device 

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "••••••");

const raw = JSON.stringify({
  "name": "module3",
  "macAddress": "00:1A:2B:3C:4D:58"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/devices", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));





  ### view device 
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "••••••");

const raw = JSON.stringify({
  "name": "module1",
  "macAddress": "00:1A:2B:3C:4D:5E"
});

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/devices", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

  ### update device 
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "••••••");

const raw = JSON.stringify({
  "name": "my first device testing",
  "macAddress": "00:1A:2B:3C:4D:5E"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/devices/001A2B3C4D5E", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));


  ### add switch 

  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "••••••");

const raw = JSON.stringify({
  "name": "ac room2",
  "pin": 2
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/devices/001A2B3C4D5E/ports", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));


  ### get switch 

  const myHeaders = new Headers();
myHeaders.append("Authorization", "••••••");

const raw = "";

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/devices/001A2B3C4D5E/ports", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

  ### user send toggle 
  const myHeaders = new Headers();
myHeaders.append("Authorization", "••••••");

const raw = "";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/devices/001A2B3C4D5E/0/toggle", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

  ### get toggle status 
  const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWZkNTFiODU3NmNkOGI1NTExM2JlYyIsImlhdCI6MTc1NjcyMTA2NCwiZXhwIjoxNzU2ODA3NDY0fQ.bepps3czRjJRkbULqn2ny8ojWA2HhTha1Alm5NiHbCo");

const raw = "";

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/devices/001A2B3C4D5E/3/curStatus", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));


  ### create schdeule 
  const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWZkNTFiODU3NmNkOGI1NTExM2JlYyIsImlhdCI6MTc1NjcyMTA2NCwiZXhwIjoxNzU2ODA3NDY0fQ.bepps3czRjJRkbULqn2ny8ojWA2HhTha1Alm5NiHbCo");

const raw = "";

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/schedules", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));


### create schdule 


const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWZkNTFiODU3NmNkOGI1NTExM2JlYyIsImlhdCI6MTc1NjcyMTA2NCwiZXhwIjoxNzU2ODA3NDY0fQ.bepps3czRjJRkbULqn2ny8ojWA2HhTha1Alm5NiHbCo");

const raw = JSON.stringify({
  "name": "Evening Schedule",
  "macSymbolId": "001A2B3C4D5E",
  "switchPin": "1",
  "scheduleTimes": {
    "offTime": "2025-09-02T06:54:11Z",
    "onTime": "2025-09-02T06:55:11Z"
  }
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/schedules", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));



