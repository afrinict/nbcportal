import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';
let token = '';

async function login() {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@nbc.gov.ng',
        password: 'password123'
      })
    });

    if (response.ok) {
      const data = await response.json();
      token = data.token;
      console.log('✅ Login successful');
      return true;
    } else {
      console.log('❌ Login failed');
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

async function createWorkflowStage(stageData) {
  try {
    const response = await fetch(`${BASE_URL}/workflow-stages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(stageData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Created workflow stage: ${stageData.name}`);
      return data;
    } else {
      const error = await response.json();
      console.log(`❌ Failed to create workflow stage: ${error.message}`);
      return null;
    }
  } catch (error) {
    console.error('Create workflow stage error:', error);
    return null;
  }
}

async function getWorkflowStages() {
  try {
    const response = await fetch(`${BASE_URL}/workflow-stages`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Found ${data.length} workflow stages`);
      return data;
    } else {
      console.log('❌ Failed to get workflow stages');
      return [];
    }
  } catch (error) {
    console.error('Get workflow stages error:', error);
    return [];
  }
}

async function main() {
  console.log('🚀 Testing Workflow Management...\n');

  // Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without login');
    return;
  }

  // Get current stages
  console.log('\n📋 Current workflow stages:');
  const currentStages = await getWorkflowStages();
  console.log(currentStages);

  // Create sample workflow stages
  const stages = [
    {
      name: "Document Review",
      description: "Initial review of submitted documents and verification of completeness",
      order: 1,
      estimatedDuration: 3,
      requiredDocuments: ["Business Registration", "Tax Clearance", "CAC Certificate"],
      assignedRole: "reviewer",
      canReject: true,
      canApprove: false
    },
    {
      name: "Technical Assessment",
      description: "Technical evaluation of broadcasting equipment and facilities",
      order: 2,
      estimatedDuration: 5,
      requiredDocuments: ["Equipment Specifications", "Site Survey Report", "Technical Drawings"],
      assignedRole: "inspector",
      canReject: true,
      canApprove: false
    },
    {
      name: "Compliance Check",
      description: "Verification of regulatory compliance and legal requirements",
      order: 3,
      estimatedDuration: 2,
      requiredDocuments: ["Compliance Certificate", "Legal Opinion", "Regulatory Checklist"],
      assignedRole: "reviewer",
      canReject: true,
      canApprove: false
    },
    {
      name: "Final Approval",
      description: "Final review and approval decision by senior management",
      order: 4,
      estimatedDuration: 1,
      requiredDocuments: ["Approval Checklist", "Management Review"],
      assignedRole: "approver",
      canReject: true,
      canApprove: true
    }
  ];

  console.log('\n📝 Creating workflow stages...');
  for (const stage of stages) {
    await createWorkflowStage(stage);
  }

  // Get updated stages
  console.log('\n📋 Updated workflow stages:');
  const updatedStages = await getWorkflowStages();
  console.log(JSON.stringify(updatedStages, null, 2));

  console.log('\n✅ Workflow management test completed!');
}

main().catch(console.error); 