import { createContext, useContext, useReducer, useEffect } from "react"
import useLocalStorage from "../hooks/useLocalStorage"

const InventoryContext = createContext(null)
const InventoryDispatchContext = createContext(null)

export const InventoryProvider = ({children}) => {
    const [inventoryInLS, setInventoryInLS] = useLocalStorage("inventory", initialInventory)
    const [inventory, dispatch] = useReducer(inventoryReducer, inventoryInLS)

    useEffect(()=>{
        setInventoryInLS(inventory)
    })

    return (
        <InventoryContext.Provider value={inventory}>
            <InventoryDispatchContext.Provider value={dispatch}>
                {children}
            </InventoryDispatchContext.Provider>
        </InventoryContext.Provider>
    )
}

export const useInventory = () => {
    return useContext(InventoryContext)
}

export const useInventoryDispatch = () => {
    return useContext(InventoryDispatchContext)
}

const inventoryReducer = (state, action) => {
    switch(action.type){
        case 'NEW_PRODUCT':{
            return [...state,{
                productName: action.productName,
                imageUrl: action.imageUrl,
                price: action.price,
                tags: action.tags,
                stock: parseInt(action.stock),
            }]
        }
        case 'STOCK_ADDED': {
            return state.map(product =>
                product.productName === action.productName
                    ? { ...product, stock: parseInt(product.stock) + parseInt(action.stock) }
                    : product 
            )
        }
        case 'STOCK_SOLD': { 
            return state.map(product =>
                product.productName === action.productName
                    ? { ...product, stock: Math.max(0, parseInt(product.stock) - parseInt(action.stock)) }
                    : product
            )
        }
        default:{
            console.log('Unknown action type: ', action.type)
            return state
        }
    }
}

const initialInventory = [
    {productName: 'Rice bag', imageUrl:'/rice bag.avif', price: 2500, tags: ["rice","grocery"], stock: 50},
    {productName: 'Hide and seek', imageUrl:'/hide and seek.jpg', price: 30, tags: ["biscuit","cookies"], stock: 20},
    {productName: 'Fortune Oil-1lr', imageUrl:'/oil.jpg', price: 180, tags: ["oil","fortune"], stock: 20},
    {productName: 'Salt-1 kg', imageUrl:'/salt.jpg', price: 25, tags: ["salt","tata"], stock: 30},
    {productName: 'Sugar-1 kg', imageUrl:'/sugar.jpg', price: 40, tags: ["sugar","sweet"], stock: 20},
    {productName: 'Toor dal-1 kg', imageUrl:'/toor.webp', price: 110, tags: ["toor","dal"], stock: 25},
    {productName: 'Aashirvaad-1kg', imageUrl:'/wheat.webp', price: 70, tags: ["wheat","flour"], stock: 30},
    {productName: 'Coffee', imageUrl:'/coffee.webp', price: 240, tags: ["coffee","levista"], stock: 10},
]