document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const rewardsGrid = document.getElementById('rewardsGrid');
    const redeemedRewardsGrid = document.getElementById('redeemedRewardsGrid');
    const userPoints = 500; // Example: User's current points, replace with actual logic to get user's points
  
    if (!rewardsGrid || !redeemedRewardsGrid) {
      console.error('Element with id "rewardsGrid" or "redeemedRewardsGrid" not found');
      return;
    }
  
    function fetchRewards() {
      fetch('/rewards')
        .then(response => response.json())
        .then(data => {
          console.log('Fetched rewards data:', data);
          rewardsGrid.innerHTML = ''; // Clear existing content
          redeemedRewardsGrid.innerHTML = ''; // Clear existing content
          
          data.forEach(reward => {
            const card = createRewardCard(reward);
            rewardsGrid.appendChild(card);
          });
        })
        .catch(error => {
          console.error('Error fetching rewards:', error);
          rewardsGrid.innerHTML = '<div>Failed to load rewards. Please try again later.</div>';
          redeemedRewardsGrid.innerHTML = '<div>Failed to load redeemed rewards. Please try again later.</div>';
        });
    }
  
    function createRewardCard(reward) {
      const card = document.createElement('div');
      card.className = 'card';
  
      const nameRow = document.createElement('div');
      nameRow.className = 'row';
      nameRow.innerHTML = `<span>Name:</span> <span>${reward.name}</span>`;
      card.appendChild(nameRow);
  
      const descriptionRow = document.createElement('div');
      descriptionRow.className = 'row';
      descriptionRow.innerHTML = `<span>Description:</span> <span>${reward.description}</span>`;
      card.appendChild(descriptionRow);
  
      const redeemedRow = document.createElement('div');
      redeemedRow.className = 'row';
      redeemedRow.innerHTML = `<span>Redeemed:</span> <span>${reward.redeemed}</span>`;
      card.appendChild(redeemedRow);
  
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';
  
      if (reward.redeemed === 'N') {
        const redeemButton = document.createElement('button');
        redeemButton.textContent = 'Redeem';
        if (canRedeem(reward)) {
          redeemButton.addEventListener('click', () => redeemReward(reward));
        } else {
          redeemButton.disabled = true;
        }
        buttonContainer.appendChild(redeemButton);
      } else {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteReward(reward.name));
        buttonContainer.appendChild(deleteButton);
      }
  
      card.appendChild(buttonContainer);
  
      return card;
    }
  
    function canRedeem(reward) {
      // Example logic: Check if user has enough points to redeem this reward
      return userPoints >= calculatePointsNeeded(reward);
    }
  
    function calculatePointsNeeded(reward) {
      // Example logic: Calculate points needed based on reward details
      // Replace this with your actual logic
      return 100; // Example: Points needed to redeem this reward
    }
  
    function redeemReward(reward) {
      console.log('Redeem reward:', reward.name);
      // Example: Simulate server-side redemption logic
      // Replace with actual fetch or AJAX request to update server and UI
      reward.redeemed = 'Y'; // Mark reward as redeemed locally
      updateRewardStatus(reward); // Update UI
  
      // Move card from rewardsGrid to redeemedRewardsGrid
      const card = createRewardCard(reward);
      redeemedRewardsGrid.appendChild(card);
    }
  
    function updateRewardStatus(reward) {
      // Example: Update reward status in database or backend server
      // Replace with actual fetch or AJAX request
      console.log('Updating reward status:', reward);
    }
  
    function deleteReward(name) {
      console.log('Delete reward:', name);
      // Add logic to delete redeemed reward (send request to server, update UI, etc.)
    }
  
    fetchRewards();
  });
  