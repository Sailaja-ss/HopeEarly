import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.impute import SimpleImputer
import joblib

# Load dataset
data = pd.read_csv("data.csv")  # Replace with your CSV path

# Drop ID and any unnamed columns
data = data.drop(['id'], axis=1)
data = data.loc[:, ~data.columns.str.contains('^Unnamed')]

# Separate features and target
X = data.drop(['diagnosis'], axis=1)
y = data['diagnosis'].map({'M': 1, 'B': 0})

# Handle missing values (if any)
imputer = SimpleImputer(strategy="mean")
X = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train Random Forest model
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# Evaluate
y_pred = rf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Test Accuracy: {accuracy*100:.2f}%")

# Save model
joblib.dump(rf, "breast_cancer_model.pkl")
print("Model saved successfully!")
