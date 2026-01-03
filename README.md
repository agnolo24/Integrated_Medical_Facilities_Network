# Integrated Medical Facilities Network (IMFN) & Robust Automatic Classification of COVID-19, Pneumonia, and Tuberculosis from X-rays

## Abstract
The Integrated Medical Facilities Network (IMFN) is a comprehensive and integrated software solution designed to streamline and enhance the operational efficiency of healthcare institutions across multiple hospitals. This system leverages advanced information technology to automate various processes, facilitating seamless communication, efficient resource management, and improved patient care on a larger scale.

IMFN encompasses a range of modules, each addressing specific aspects of hospital administration across multiple locations. These modules include Patient Registration, Appointment Scheduling, Electronic Health Records (EHR), Billing and Invoicing, Pharmacy Management, Laboratory Information System (LIS). By extending these functionalities to multiple hospitals, IMFN provides a unified platform for healthcare professionals to manage patient data, track medical histories, schedule appointments, and prescribe medications across a network of healthcare facilities.

### Key Features
1. **Centralized Patient Records**: Maintain a centralized repository of patient records accessible across all affiliated hospitals, ensuring seamless continuity of care and efficient information exchange.  
2. **Inter-Hospital Appointment Coordination**: Facilitate appointment scheduling for patients across different hospitals within the network, optimizing resource utilization and providing flexibility in healthcare service delivery.  
3. **Integrated Billing and Financial Management**: Streamline financial transactions and billing processes for services provided at various hospitals, with centralized reporting for financial transparency and analysis.  
4. **Pharmacy and Inventory Management Across Facilities**: Efficiently manage medication inventory and pharmacy operations, ensuring consistent practices and timely medication dispensation across all hospitals.  
5. **Interconnected Laboratory Information System**: Facilitate communication and information sharing between laboratories in different hospitals, enhancing diagnostic capabilities and improving the efficiency of test result management.  

---

The global pandemic of coronavirus disease 2019 (COVID-19) is continuing to have a significant effect on the well-being of the global population, thus increasing the demand for rapid testing, diagnosis, and treatment. As COVID-19 can cause severe pneumonia, early diagnosis is essential for correct treatment, as well as to reduce the stress on the healthcare system. Along with COVID-19, other etiologies of pneumonia and Tuberculosis (TB) constitute additional challenges to the medical system. Pneumonia (viral as well as bacterial) kills about 2 million infants every year and is consistently estimated as one of the most important factor of childhood mortality (according to the World Health Organization).

Chest X-ray (CXR) and computed tomography (CT) scans are the primary imaging modalities for diagnosing respiratory diseases. Although CT scans are the gold standard, they are more expensive, time consuming, and are associated with a small but significant dose of radiation. Hence, CXR have become more widespread as a first line investigation.

In this regard, the objective of this work is to develop a new deep transfer learning pipeline, named **DenResCov-19**, to diagnose patients with COVID-19, pneumonia, TB or healthy based on CXR images. The pipeline consists of the existing DenseNet-121 and the ResNet-50 networks. Since the DenseNet and ResNet have orthogonal performances in some instances, in the proposed model we have created an extra layer with convolutional neural network (CNN) blocks to join these two models together to establish superior performance as compared to the two individual networks. This strategy can be applied universally in cases where two competing networks are observed.

We have tested the performance of our proposed network on two-class (pneumonia and healthy), three-class (COVID-19 positive, healthy, and pneumonia), as well as four-class (COVID-19 positive, healthy, TB, and pneumonia) classification problems. We have validated that our proposed network has been able to successfully classify these lung-diseases on our four datasets and this is one of our novel findings. In particular, the AUC-ROC are **99.60, 96.51, 93.70, 96.40%** and the F1 values are **98.21, 87.29, 76.09, 83.17%** on our Dataset X-Ray 1, 2, 3, and 4 (DXR1, DXR2, DXR3, DXR4), respectively.

---

## Modules

### Admin Module
*(Details not specified)*

### Hospital Module
- Registration  
- Patients registration with ID creation  
- Location finding  
- Payments checking  
- Doctors handling  
- Details passing to another hospital  
- Reports passing  

### Patient Module
- Registration  
- Hospital searching  
- Image comparison  
- ID selection  
- Doctor finding  
- Geo location transferring  
- Payments  
- Communication  
- Route finding  
- X-Ray uploading  

### Doctor Module
- Patients checking  
- History checking  
- Communication  
- Records checking  
- Prescription adding  
- X-ray checking  

### Ambulance Module
- Registration  
- Location finding  
- Confirmation  
- Status updating  
- Availability updating  
<<<<<<< HEAD



name
gender
specialization
dob
hos name
qualification
exp
contact number
email
password



category
type
vec num
hospital
con num
name
email
password

=======
>>>>>>> a6769ae0abb9098e45234bfc32df2c78025b962b
