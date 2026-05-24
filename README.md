# Diabetic Retinopathy Detection (2-Stage Model)

## Overview
This project uses a 2-stage deep learning pipeline:

1. Binary Classification (No DR vs DR)
2. Severity Classification (Mild / Moderate / Severe / PDR)

## Files
- binary_model.pth
- severity_model.pth
- config.json
- reload_later.py
- requirements.txt

## How to Run

1. Install dependencies
pip install -r requirements.txt

2. Run inference
python reload_later.py

## Workflow
- Input: fundus image
- Step 1: Binary model -> detect DR
- Step 2: If DR -> classify severity

## Disclaimer
This system is for screening support only, not a medical diagnosis.
