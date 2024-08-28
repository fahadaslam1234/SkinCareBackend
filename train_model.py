import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Load the dataset
df = pd.read_csv('data/skincare_recommendations_comprehensive.csv')

# Preprocess the data
X = df[['skin_conditions', 'skin_feel', 'ingredient_preferences']]
y = df['product_name']

# Vectorize the categorical columns
X = pd.get_dummies(X)

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# X_train, X_test, y_train, y_test  are output variables
# train_test_split splits the dataset into train and test

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, 'skincare_model.pkl')
