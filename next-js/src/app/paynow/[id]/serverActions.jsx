// 'use server';

// export async function create(formData) {
//     const file = formData.get('image');
    
//     console.log('file', file);
    
// }


// export async function create(formData) {
//     const file = formData.get('image');
//     try {
//         const response = await fetch('http://localhost:3000/receipts', {
//             method: 'POST',
//             body: formData
//         });

//         if (!response.ok) {
//             throw new Error('Failed to create receipt');
//         }

//         const data = await response.json();
//         console.log('Receipt created:', data);
//         return data;
//     } catch (error) {
//         console.error('Error creating receipt:', error);
//         throw error;
//     }
// }



