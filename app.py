import json
import numpy as np
import pandas as pd
from sklearn.manifold import MDS
from flask import Flask, jsonify, render_template
from sklearn.model_selection import train_test_split
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler,LabelEncoder
from sklearn.metrics.pairwise import manhattan_distances, euclidean_distances

app = Flask(__name__, static_url_path='/static')

DATA_FILE_PATH = "/home/radone/Vis/lab1/data.csv"
label_encoder = LabelEncoder()

def convert_to_integer(value):
    if isinstance(value, str) and 'Above' in value:
        return 96  # Replace with the desired integer value
    elif isinstance(value, str) and '%' in value:
        return int(float(value.strip('%')))  
    else:
        return int(value)

def preprocess(DATA_FILE_PATH,test_size,type):
    df = pd.read_csv(DATA_FILE_PATH)
    df['Economic Need Index'] = df['Economic Need Index'].apply(convert_to_integer)
    df['% Poverty'] = df['% Poverty'].apply(convert_to_integer)
    stratified_sample, _ = train_test_split(df, test_size=test_size, stratify=df['Year'])
    stratified_sample['School Name'] = label_encoder.fit_transform(stratified_sample['School Name'])
    stratified_sample['DBN'] = label_encoder.fit_transform(stratified_sample['DBN'])
    stratified_sample['Year'] = label_encoder.fit_transform(stratified_sample['Year'])
    stratified_sample['# Poverty'] = label_encoder.fit_transform(stratified_sample['# Poverty'])
    float_columns = stratified_sample.select_dtypes(include=['float64']).columns
    stratified_sample[float_columns] = stratified_sample[float_columns].astype('int64')
    return stratified_sample

def mds_transform(stratified_sample):
    print("In MDS")
    mds = MDS(n_components=2,metric=False,n_jobs=1,dissimilarity='euclidean')
    X_transform = mds.fit_transform(stratified_sample)
    return X_transform

def kmeans_transform(stratified_sample):
    X_transform = mds_transform(stratified_sample)
    kmeans = KMeans(n_clusters=5, random_state=42)
    cluster_ids = kmeans.fit_predict(X_transform)

    # Create a DataFrame with cluster IDs
    df = pd.DataFrame(X_transform, columns=['Feature1', 'Feature2'])
    df['ClusterID'] = cluster_ids
    return df


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/show_mds_data')
def show_mds():
    try:
        pre_data = preprocess(DATA_FILE_PATH,0.99,'MDS')
        mds_matrix = mds_transform(pre_data)
        df = pd.DataFrame(mds_matrix, columns=['distance1','distance2'])
        data = df.to_dict()
        json_data = jsonify(data) 
        return json_data
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/show_cluster_mds')
def show_cluster_mds():
    try:
        pre_data = preprocess(DATA_FILE_PATH,0.99,'MDS')
        classified_data = kmeans_transform(pre_data)
        data = classified_data.to_dict()
        json_data = jsonify(data)
        return json_data
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/show_pcp_plot')
def show_pcp_plot():
    try:
        pcp_data = preprocess(DATA_FILE_PATH,0.99,'PCP')
        data = pcp_data.to_dict()
        json_data = jsonify(data)
        return json_data
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/show_cluster_pcp')
def show_cluster_pcp():
    try:
        pcp_data = preprocess(DATA_FILE_PATH,0.99,'PCP')
        kmeans = KMeans(n_clusters=5, random_state=42)
        cluster_ids = kmeans.fit_predict(pcp_data)
        pcp_data['ClusterID'] = cluster_ids
        data = pcp_data.to_dict()
        json_data = jsonify(data)
        return json_data
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)

