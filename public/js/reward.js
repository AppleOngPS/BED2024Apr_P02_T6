// rewards.js

document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM fully loaded and parsed');
  const rewardsGrid = document.getElementById('rewardsGrid');
  const redeemedRewardsGrid = document.getElementById('redeemedRewardsGrid');
  let userPoints = 0;

  if (!rewardsGrid || !redeemedRewardsGrid) {
    console.error('Element with id "rewardsGrid" or "redeemedRewardsGrid" not found');
    return;
  }

  // Fetch user points function
  async function fetchUserPoints(username, password) {
    try {
      const response = await fetch(`http://localhost:3000/points?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch points');
      }
      const data = await response.json();
      return data.points || 0;
    } catch (error) {
      console.error('Error fetching user points:', error);
      return 0; // Return default points if fetching fails
    }
  }

  // Function to fetch rewards
  async function fetchRewards() {
    try {
      const response = await fetch('http://localhost:3000/rewards');
      if (!response.ok) {
        throw new Error('Failed to fetch rewards');
      }
      const data = await response.json();
      console.log('Fetched rewards data:', data);
      renderRewards(data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      rewardsGrid.innerHTML = '<div>Failed to load rewards. Please try again later.</div>';
      redeemedRewardsGrid.innerHTML = '<div>Failed to load redeemed rewards. Please try again later.</div>';
    }
  }

  // Function to render rewards in UI
  function renderRewards(rewards) {
    rewardsGrid.innerHTML = ''; // Clear existing content
    redeemedRewardsGrid.innerHTML = ''; // Clear existing content

    rewards.forEach(reward => {
      const card = createRewardCard(reward);
      if (reward.redeemed === 'Y') {
        redeemedRewardsGrid.appendChild(card);
      } else {
        rewardsGrid.appendChild(card);
      }
    });

    // Update user points display
    const pointsElement = document.getElementById('pointsValue');
    pointsElement.textContent = userPoints.toString();
  }

  // Function to create reward card
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
      redeemButton.addEventListener('click', () => redeemReward(reward));
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

  // Function to redeem reward
  async function redeemReward(reward) {
    console.log('Redeem reward:', reward.name);
    try {
      const response = await fetch(`http://localhost:3000/redeem/${reward.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ redeemed: true })
      });

      if (!response.ok) {
        throw new Error('Failed to redeem reward');
        
      }

      const updatedReward = await response.json();
      console.log('Redeemed reward:', updatedReward);
      fetchRewards(); // Fetch updated rewards after redemption
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Failed to redeem reward. Please earn more points.');
    }
    
  }

  // Function to delete redeemed reward (not implemented in backend here)
  function deleteReward(name) {
    console.log('Delete reward:', name);
    // Implement logic to delete redeemed reward (if needed)
  }

  // Fetch user points and rewards when DOM is fully loaded
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (loggedInUser) {
    userPoints = await fetchUserPoints(loggedInUser.name, loggedInUser.password);
    console.log('User points:', userPoints);
    fetchRewards();
  } else {
    console.error('User not logged in');
    // Handle case where user is not logged in
  }
});
