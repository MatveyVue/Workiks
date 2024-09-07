<template>
<h3>Announcement:</h3>
<button class="all"><b>All</b><br><div class="line"></div></button>
<button class="all"><RouterLink style="text-decoration: none; color: inherit;" to="/verif">Verif</RouterLink></button>
<button class="all"><RouterLink style="text-decoration: none; color: inherit;" to="/program">Program</RouterLink></button>
<button style="margin-left: 30px;" class="all"><RouterLink style="text-decoration: none; color: inherit;" to="/ads">Ads</RouterLink></button>

<div class="announcement1">
  <h2>1$</h2>
  <hr>
  <p style="color: white; font-family: Arial; margin-left: 15px;"><b>Sinsik</b></p>
  <p style="color: #b1b1b1; font-family: Roboto; margin-left: 15px;">Vacancy: Rrogrammist</p>
  <p style="color: #b1b1b1; font-family: Roboto; margin-left: 15px;">Description: Need help writing Script code for one project</p>
  <p style="color: #b1b1b1; font-family: Roboto; margin-left: 15px;">Type: Verif</p>
  <a href="https://t.me/stttnsik">
  <button style="margin-left: 15px; background-color: #747474; border: none; border-radius: 15px; color: White; cursor: pointer">In Detail</button>
  </a>
</div>
</template>

<script>

</script>

<style scoped>
h3 {
  color: white;
  font-family: Arial;
  font-size: 26px;
  }
  
  h4 {
  color: #404049;
  }
  
  h2 {
  color: white;
  font-family: Roboto;
  margin-left: 15px;
  margin-top: 50px;
  }
  
  .announcement1 {
  background-color: #404049;
  width: 397px;
  height: 255px;
  margin-left: 1px;
  border: none;
  border-radius: 20px;
  color: #727272;
  }
  
  .all {
  background-color: rgb(36, 36, 44);
  border: none;
  cursor: pointer;
  color: white;
  font-family: Roboto;
  margin-top: 30px;
  margin-left: 10px;
  width: 50px;
  height: 20px;
  font-size: 16px;
  }
  
  .line {
  background-color: #618ec2;
  width: 35px;
  height: 3px;
  margin-left: -6px;
  }

  h4 {
  margin-left: 340px;
  margin-top: -65px;
  background-color: rgb(36, 36, 44);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  }
</style>
