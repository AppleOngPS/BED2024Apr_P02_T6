document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM fully loaded and parsed');

  const rewardsGrid = document.getElementById('rewardsGrid');
  const redeemedRewardsGrid = document.getElementById('redeemedRewardsGrid');
  const pointsElement = document.getElementById('pointsValue');
  let userPoints = 0;

  if (!rewardsGrid || !redeemedRewardsGrid || !pointsElement) {
    console.error('Element with id "rewardsGrid", "redeemedRewardsGrid", or "pointsValue" not found');
    return;
  }

  // Function to fetch user points
  async function fetchUserPoints(username, password) {
    try {
      const response = await fetch(`http://localhost:3000/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch points');
      }
      const data = await response.json();
      console.log('Fetched user points data:', data);
      
      const user = data.find(user => user.name === username && user.password === password);
      return user && user.point !== null && user.point !== undefined ? user.point : 0;
    } catch (error) {
      console.error('Error fetching user points:', error);
      return 0;
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
    rewardsGrid.innerHTML = '';
    redeemedRewardsGrid.innerHTML = '';

    rewards.forEach(reward => {
      const card = createRewardCard(reward);
      if (reward.redeemed === 'Y') {
        redeemedRewardsGrid.appendChild(card);
      } else {
        rewardsGrid.appendChild(card);
      }
    });

    pointsElement.textContent = `${userPoints}`;
    console.log('User points displayed:', userPoints);
  }

  // Function to create reward card and handle redemption or deletion
  function createRewardCard(reward) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-id', reward.id);

    const nameRow = document.createElement('div');
    nameRow.className = 'row';
    nameRow.innerHTML = `<span>${reward.name}</span>`;
    card.appendChild(nameRow);

    const descriptionRow = document.createElement('div');
    descriptionRow.className = 'row';
    descriptionRow.innerHTML = `<span>${reward.description}</span>`;
    card.appendChild(descriptionRow);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    if (reward.redeemed === 'Y') {
      // Create Delete button for redeemed rewards
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteReward(reward));
      buttonContainer.appendChild(deleteButton);
    } else {
      // Create Redeem button for available rewards
      const redeemButton = document.createElement('button');
      redeemButton.textContent = 'Redeem';
      redeemButton.addEventListener('click', () => redeemReward(reward));
      buttonContainer.appendChild(redeemButton);
    }

    card.appendChild(buttonContainer);

    return card;
  }

  // Function to handle redeeming rewards
  async function redeemReward(reward) {
    try {
      if (reward.point <= userPoints) {
        const response = await fetch(`http://localhost:3000/redeem/${reward.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        if (!response.ok) {
          throw new Error('Failed to redeem reward');
        }

        reward.redeemed = 'Y';
        userPoints -= reward.point;
        updateRewardUI(reward);
        await updateUserPoints(); // Update user points after redeeming
      } else {
        alert('Insufficient points to redeem this reward');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  }

  // Function to handle deleting rewards
  async function deleteReward(reward) {
    try {
      const response = await fetch(`http://localhost:3000/rewards/${reward.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete reward');
      }

      const cardToRemove = redeemedRewardsGrid.querySelector(`.card[data-id="${reward.id}"]`);
      if (cardToRemove) {
        redeemedRewardsGrid.removeChild(cardToRemove);
      }alert('Rewards deleted successfully');
    } catch (error) {
      console.error('Error deleting reward:', error);
    }
  }

  // Function to update UI after redeeming or deleting reward
  function updateRewardUI(redeemedReward) {
    const cardToRemove = rewardsGrid.querySelector(`.card[data-id="${redeemedReward.id}"]`);
    if (cardToRemove) {
      rewardsGrid.removeChild(cardToRemove);
      const newCard = createRewardCard(redeemedReward);
      redeemedRewardsGrid.appendChild(newCard);
    }
    pointsElement.textContent = `${userPoints}`;
  }

  // Function to handle update user points
  async function updateUserPoints() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      try {
        const updatedUserData = {
          name: loggedInUser.name,
          point: userPoints
        };
        const response = await fetch('http://localhost:3000/users/points', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedUserData)
        });

        if (!response.ok) {
          throw new Error('Failed to update user data');
        }

        alert('Rewards redeemed and points updated successfully');
      } catch (error) {
        console.error('Error updating points:', error);
        alert('Error updating points. Please try again.');
      }
    }
  }

  fetchRewards();

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (loggedInUser) {
    console.log('Logged in user:', loggedInUser);
    userPoints = await fetchUserPoints(loggedInUser.name, loggedInUser.password);
    console.log('User points fetched:', userPoints);
    pointsElement.textContent = `${userPoints}`;
  } else {
    console.error('User not logged in');
  }
});
