-- AccountUser table

CREATE TABLE AccountUser (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE, 
  password VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  contactNumber VARCHAR(15) NOT NULL, 
  age TINYINT NOT NULL, 
  height DECIMAL(5,2) NOT NULL, 
  weight DECIMAL(5,2) NOT NULL,
  weightGoal DECIMAL(5,2) NOT NULL, 
  TargetCalarieIntake VARCHAR(255) NOT NULL,
  point int NULL DEFAULT 0

);


-- Insert data into Books table
INSERT INTO AccountUser (name, password, email, contactNumber, age, height, weight, weightGoal, TargetCalarieIntake,point)
VALUES
  ('Apple', '1111', 'apple@gmail.com', '91234561', 25, 166.0, 50.0, 60.0, '1750',100),
  ('Joy', '456', 'joy@gmail.com', '91982766', 22, 177.0, 50.0, 55.0, '1250',0),
  ('Peter', '477', 'peter@gmail.com', '84338766', 30, 189.0, 60.0, 70.0, '2150',0);

 
  select*from AccountUser;


-- rewards table

  Create table rewards (
  id int identity(1,1) primary key,
  name varchar(50)not null,
  description varchar(255) not null,
  redeemed CHAR(1) CHECK (redeemed IN ('y', 'n')),
  point int not null
  )

  insert into rewards(name,description,redeemed,point)
  values
  ('$50 FairPrice E-Voucher','To accumulate 500 points to redeem','N',500),
  ('$10 FairPrice E-Voucher','To accumulate 100 points to redeem','N',100),
  ('$5 MrBean E-Voucher','To accumulate 50 points to redeem','N',50),
  ('$10 MrBean E-Voucher','To accumulate 100 points to redeem','N',100),
  ('$10 HPB E-Voucher','To accumulate 100 points to redeem','Y',100),
  ('$5 HPB E-Voucher','To accumulate 50 points to redeem','N',50),
  ('$5 LiHo E-Voucher','To accumulate 50 points to redeem','N',50),
  ('25% off total bill LiHo E-Voucher','To accumulate 50 points to redeem','N',50),
  ('$15 off Simply Wrapps E-Voucher','To accumulate 150 points to redeem','N',150),
  ('$10 off Simply Wrapps E-Voucher','To accumulate 100 points to redeem','N',100);

  select*from rewards;
