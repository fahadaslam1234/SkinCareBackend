import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Load the dataset
df = pd.read_csv('data/skincare_recommendations_comprehensive.csv')

# Preprocess the data
X = df[['condition', 'skin_feel', 'makeup_area', 'sunscreen_preference', 'body_concern']]
y = df['product_name']

# Vectorize the categorical columns
X = pd.get_dummies(X)

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, 'skincare_model.pkl')
