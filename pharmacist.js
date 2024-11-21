var MongoClient = require('/database.js').MongoClient;

const connection_url = "url"




async function retry(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn(); // Try to execute 
        } catch (error) {
            if (i === retries - 1) throw error; // Rethrow error if last attempt fails
            console.log('Attempt ${i+1} failed. Retrying...')
            await new Promise(res => setTimeout(res, delay)); // Wait before retrying
        }
    }
}

class PrescriptionCommand {
    constructor(patientData, prescriptionData) {
        this.patientData = patientData;
        this.prescriptionData = prescriptionData;
    }

    // to be implemented by subclasses
    async execute() {
        throw new Error("subclass didnt invoke execute");
    }

    async connectToDatabase(){
        return new Promise((resolve, reject) => {
            MongoClient.connect(connection_url, (err, client) => {
                if(err){
                    reject(new Error("Database connection failed: ${err.message}"));
                    return;
                }
                resolve(client);
            });
        });
    }
}

class AddPrescriptionCommand extends PrescriptionCommand {
    async execute() {
        // database
    }
}

async function addPerscription() {

    // database stuff

    /* 
        const client = await this.connectToDatabase();

        try {
            const db = client.db('team11');
            const patientsCollection = db.collection('patient');

            // Prepare prescription entry with additional metadata
            const prescriptionEntry = {
                ...prescriptionData,
                prescriptionId: new MongoClient.ObjectId(),
                createdAt: new Date(),
                status: 'active'
            };

            // Update patient record: add prescription 
            const result = await patientsCollection.updateOne(
                { email: patientData.name }, // Find patient by email
                { 
                    // Append new prescription to prescriptions array
                    $push: { 
                        prescriptions: prescriptionEntry 
                    },
         
                },
                // Create patient record if not exists
                { upsert: true }
            );

            return result.modifiedCount || result.upsertedCount 
                ? "Prescription added successfully" 
                : "No prescription added";
        } catch (error) {
            throw new Error(`Prescription insertion failed: ${error.message}`);
        } finally {
            client.close();
        }
}
    
    
    */



}

class PrescriptionInvoker {
    constructor() {}

    async submitPrescription(command) {
        return await retry (() => command.execute());
    }
}



async function submitPrescription(event) {
    event.preventDefault(); 

    const prescriptionData = {
        medication: document.getElementById("medication").value,
        dosage: document.getElementById("dosage").value,
        instructions: document.getElementById("instructions").value,
    };

    const patientData = {
        name: document.getElementById("patientName").value,
       // email: document.getElementById("email").value;

    };

    const prescriptionCommand= new AddPrescriptionCommand(patientData, prescriptionData);

    const prescriptionInvoker = new PrescriptionInvoker();


    try {
        
            const result = await prescriptionInvoker.submitPrescription(prescriptionCommand);



        document.getElementById("result").textContent = result; // Display success message
        document.getElementById("result").style.color = green; 
        document.getElementById("prescriptionForm").reset();
    } catch (error) {
        document.getElementById("result").textContent = `Failed to submit prescription: ${error.message}`; // Display error message
        document.getElementById("result").style.color = red; 
    }

    // event listener for form submission
    document.getElementById("prescriptionForm").addEventListener("submit", submitPrescription);

}







