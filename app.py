from flask import Flask, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

# Load the pre-trained model
model = joblib.load('skincare_model.pkl')

# Load the dataset to ensure consistent features
df = pd.read_csv('data/skincare_recommendations_comprehensive.csv')
X = df[['condition', 'skin_feel', 'makeup_area', 'sunscreen_preference', 'body_concern']]
X = pd.get_dummies(X)
columns = X.columns

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    input_data = pd.DataFrame([data])
    input_data = pd.get_dummies(input_data).reindex(columns=columns, fill_value=0)
    
    # Ensure the input data has the same columns as the training data
    input_data = input_data.reindex(columns=columns, fill_value=0)
    
    # Predict the product
    prediction = model.predict(input_data)
    
    # Extract product details from the original dataset based on the prediction
    product = df[df['product_name'] == prediction[0]].iloc[0]
    recommended_product = {
        "product_name": product['product_name'],
        "product_description": product['product_description'],
        "product_image_url": product['product_image_url']
    }
    
    return jsonify(recommended_product)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
