document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const rewardsGrid = document.getElementById('rewardsGrid');
    const redeemedRewardsGrid = document.getElementById('redeemedRewardsGrid');
  
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
            //redeemedRow.innerHTML = `<span>Redeemed:</span> <span>${reward.redeemed}</span>`;
            card.appendChild(redeemedRow);
  
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
  
            if (reward.redeemed === 'N') {
              const redeemButton = document.createElement('button');
              redeemButton.textContent = 'Redeem';
              redeemButton.addEventListener('click', () => redeemReward(reward.name));
              buttonContainer.appendChild(redeemButton);
            } else {
              const deleteButton = document.createElement('button');
              deleteButton.textContent = 'Delete';
              deleteButton.addEventListener('click', () => deleteReward(reward.name));
              buttonContainer.appendChild(deleteButton);
            }
  
            card.appendChild(buttonContainer);
  
            if (reward.redeemed === 'y') {
              redeemedRewardsGrid.appendChild(card);
            } else {
              rewardsGrid.appendChild(card);
            }
          });
        })
        .catch(error => {
          console.error('Error fetching rewards:', error);
          rewardsGrid.innerHTML = '<div>Failed to load rewards. Please try again later.</div>';
          redeemedRewardsGrid.innerHTML = '<div>Failed to load redeemed rewards. Please try again later.</div>';
        });
    }
  
    function redeemReward(name) {
      console.log('Redeem reward:', name);
      // Add logic to mark reward as redeemed (send request to server, update UI, etc.)
    }
  
    function deleteReward(name) {
      console.log('Delete reward:', name);
      // Add logic to delete redeemed reward (send request to server, update UI, etc.)
    }
  
    fetchRewards();
  });
  