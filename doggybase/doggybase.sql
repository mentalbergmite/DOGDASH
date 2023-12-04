-- Create a table for Products
CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Description TEXT,
    CategoryID INT,
    StockQuantity INT
);

-- Create a table for Categories
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY,
    CategoryName VARCHAR(255) NOT NULL
);

-- Create a table for Customers
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    Address VARCHAR(255)
);

-- Create a table for Orders
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    Status VARCHAR(20) NOT NULL
);

-- Create a table for OrderDetails
CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    Quantity INT NOT NULL,
    Subtotal DECIMAL(10, 2) NOT NULL
);

-- Create a table for Customers
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(255) NOT NULL,
    CustomerEmail VARCHAR(100) NOT NULL,
    CustomerPhone VARCHAR(20),
    CustomerAddress VARCHAR(255)
);

-- Create a table for CustomerLogins
CREATE TABLE CustomerLogins (
    CustomerLoginID INT PRIMARY KEY,
    CustomerID INT,
    Username VARCHAR(50) NOT NULL,
    PasswordHash VARCHAR(100) NOT NULL,
    Salt VARCHAR(50) NOT NULL
);

-- Create a table for Sellers
CREATE TABLE Sellers (
    SellerID INT PRIMARY KEY,
    SellerName VARCHAR(255) NOT NULL,
    SellerEmail VARCHAR(100) NOT NULL,
    SellerPhone VARCHAR(20),
    SellerAddress VARCHAR(255)
);

-- Create a table for SellerLogins
CREATE TABLE SellerLogins (
    SellerLoginID INT PRIMARY KEY,
    SellerID INT,
    Username VARCHAR(50) NOT NULL,
    PasswordHash VARCHAR(100) NOT NULL,
    Salt VARCHAR(50) NOT NULL
);

-- Create foreign key relationships
ALTER TABLE CustomerLogins ADD FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID);
ALTER TABLE SellerLogins ADD FOREIGN KEY (SellerID) REFERENCES Sellers(SellerID);
ALTER TABLE Products ADD FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID);
ALTER TABLE Orders ADD FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID);
ALTER TABLE OrderDetails ADD FOREIGN KEY (OrderID) REFERENCES Orders(OrderID);
ALTER TABLE OrderDetails ADD FOREIGN KEY (ProductID) REFERENCES Products(ProductID);
