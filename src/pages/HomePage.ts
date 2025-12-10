import { ref } from 'vue';

export function useHomePage() {
    const categories = ref([
        { name: 'Tank Top', icon: 'https://i.imgur.com/KvE63rR.png' },
        { name: 'Shirt', icon: 'https://i.imgur.com/sTjaOUC.png' },
        { name: 'Shoes', icon: 'https://i.imgur.com/f2S1d85.png' },
        { name: 'Dresses', icon: 'https://i.imgur.com/ZJjs3gS.png' },
        { name: 'Home', icon: 'https://i.imgur.com/54z4Ipc.png' },
        { name: 'Bag', icon: 'https://i.imgur.com/Jv3aQ0S.png' },
    ]);

    const onSaleProducts = ref([
        {
            id: 1,
            name: 'Draped Satin Set',
            price: '$99',
            image: 'https://i.imgur.com/o9M4Y3f.png',
            discount: '20%',
        },
        {
            id: 2,
            name: 'Satin Dress Sleeveless',
            price: '$129',
            image: 'https://i.imgur.com/SjA1T2H.png',
            discount: '20%',
        },
        {
            id: 3,
            name: 'Casual Linen Shirt',
            price: '$45',
            image: 'https://i.imgur.com/sTjaOUC.png',
            discount: '15%',
        },
        {
            id: 4,
            name: 'Summer Floral Dress',
            price: '$79',
            image: 'https://i.imgur.com/ZJjs3gS.png',
            discount: '10%',
        },
    ]);

    return {
        categories,
        onSaleProducts,
    };
}
