<template>
<center>
  <img class="hello" src="https://media2.giphy.com/media/JSbUaZYHSyFViDtiDW/giphy.gif?cid=9b38fe91309c4q7im6bvn94k77o5ns75ojlbdcmm6tdt76ra&ep=v1_gifs_username&rid=giphy.gif&ct=g">
  <h1>Workiks</h1>
  <p>Find an affordable job at<br>Workiks</p>

  <button class="go"><RouterLink style="text-decoration: none; color: inherit;" to="/home"><h2>Go Workiks</h2></RouterLink></button>
</center>    
</template>

<style scoped>
button {
  background-color: rgb(94, 124, 170);
  border: none;
  border-radius: 15px;
  width: 370px;
  height: 50px;
  margin-top: 100px;
  cursor: pointer;
  }
  
  .hello {
  border-radius: 20%;
  width: 300px;
  height: 300px;
  margin-top: 30px;
  }
  
  h1 {
  font-family: Roboto;
  font-size: 24px;
  color: white;
  margin-top: 50px;
  }
  
  p {
  color: white;
  font-family: Roboto;
  }

  h2 {
  color: white;
  font-family: Roboto;
  }
</style>
