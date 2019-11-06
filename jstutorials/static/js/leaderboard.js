function get_random_bg(){
  const random = Math.floor(Math.random() * 5)
  if (random == 0){
    return "bg-secondary";
  }
  else if (random == 1){
    return "bg-info";
  }
  else if (random == 2){
    return "bg-green";
  }
  else if (random == 3){
    return "bg-blue"
  }
  else{
    return "bg-deep-pink";
  }
}

function update_bg(id){
  const bg = get_random_bg();
  document.getElementById(`leaderboard_${id}`).classList.add(bg);
  // target.classList.add(bg);
}