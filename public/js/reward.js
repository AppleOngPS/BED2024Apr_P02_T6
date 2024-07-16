document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM fully loaded and parsed');
  
  const rewardsGrid = document.getElementById('rewardsGrid');
  const redeemedRewardsGrid = document.getElementById('redeemedRewardsGrid');
  const pointsElement = document.getElementById('pointsValue');
  let userPoints = 0;

  if (!rewardsGrid || !redeemedRewardsGrid) {
    console.error('Element with id "rewardsGrid" or "redeemedRewardsGrid" not found');
    return;
  }

  // Fetch user points function
  async function fetchUserPoints(username, password) {
    try {
      const response = await fetch(`http://localhost:3000/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch points');
      }
      const data = await response.json();
      console.log('Fetched user points data:', data); // Log the fetched data
      
      // Assuming data is an array, find the correct user and return their points
      const user = data.find(user => user.name === username && user.password === password);
      return user && user.point !== null && user.point !== undefined ? user.point : 0; // Adjust based on API response structure
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
    pointsElement.textContent = userPoints.toString();
    console.log('User points displayed:', userPoints); // Log the displayed points
  }


// Function to create reward card and display data
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
    redeemButton.addEventListener('click', () => redeemReward(reward)); // Pass 'reward' object here
    buttonContainer.appendChild(redeemButton);
  } else {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteReward(reward.id));
    buttonContainer.appendChild(deleteButton);
  }

  card.appendChild(buttonContainer);

  return card;
}

async function redeemReward(reward) {
  try {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      throw new Error('User not logged in');
    }

    // Check if user has enough points
    if (userPoints < reward.point) {
      alert('You do not have enough points to redeem this reward.');
      return;
    }

    console.log("Attempting to redeem reward:", reward);

    // Make POST request to redeem the reward
    const response = await fetch(`http://localhost:3000/rewards/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rewardId: reward.id, userId: loggedInUser.id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to redeem reward: ${response.status} - ${response.statusText}`);
    }

    // Reward successfully redeemed, deduct points from user's account
    userPoints -= reward.point;
    pointsElement.textContent = userPoints.toString();

    // Refresh rewards and update UI
    await fetchRewards(); // Wait for fetch to complete
    console.log("Reward redeemed successfully");

    // Move redeemed reward to the redeemed rewards grid
    const card = createRewardCard(reward);
    redeemedRewardsGrid.appendChild(card);
    rewardsGrid.removeChild(card); // Remove from original grid

    alert("Reward redeemed successfully");
  } catch (error) {
    console.error("Error redeeming reward:", error);
    alert("Error redeeming reward. Please try again.");
  }
}


  async function deleteReward(rewardId) {
    try {
      console.log('Deleting reward:', rewardId);
      const response = await fetch(`http://localhost:3000/rewards/${rewardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete reward');
      }

      console.log('Reward deleted successfully');
      fetchRewards(); // Refresh rewards after deletion
    } catch (error) {
      console.error('Error deleting reward:', error);
      alert('Failed to delete reward. Please try again.');
    }
  }

  // Fetch rewards when DOM is fully loaded
  fetchRewards();

  // Fetch user points and display them
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (loggedInUser) {
    console.log('Logged in user:', loggedInUser); // Log the logged in user
    userPoints = await fetchUserPoints(loggedInUser.name, loggedInUser.password);
    console.log('User points fetched:', userPoints); // Log the fetched user points
    pointsElement.textContent = userPoints; // Ensure points are displayed immediately
  } else {
    console.error('User not logged in');
    // Handle case where user is not logged in
  }
});
