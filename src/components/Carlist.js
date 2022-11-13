import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from '@mui/material/Button';
import Addcar from './Addcar';
import Editcar from './Editcar';

export default function Carlist() {

    const [cars, setCars] = useState([]);

    const deleteButton = (rowValue) => {
        return <Button size="small" color="secondary" onClick={() => deleteCar(rowValue)}>Delete</Button>
    }

    const editCar = (row) => {
        return <Editcar updateCar={updateCar} car={row.data} />
    }

    const deleteCar = (link) => {
        if (window.confirm("Are you sure?")) {
            fetch(link.value, {method: 'DELETE'})
            .then(res => fetchData())
            .catch(err => console.error(err))
        }
        
    }

    const saveCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const updateCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
    }

    const columns = [
        {headerName: "Brand", field: "brand", sortable:true, filter: true, floatingFilter: true},
        {headerName: "Model", field: "model", sortable:true, filter: true, floatingFilter: true},
        {headerName: "Color", field: "color", sortable:true, filter: true, floatingFilter: true},
        {headerName: "Fuel", field: "fuel", sortable:true, filter: true, floatingFilter: true},
        {headerName: "Year", field: "year", sortable:true, filter: true, floatingFilter: true},
        {headerName: "Price", field: "price", sortable:true, filter: true, floatingFilter: true},
        {headerName: "", width: 100, cellRenderer: editCar},
        {headerName: "", width: 130, field: "_links.self.href", cellRenderer: deleteButton}
    ]

    return (
        <div className='ag-theme-material'
            style={{height: '1000px', width: '80%', margin: 'auto'}}>
            <Addcar saveCar={saveCar} />
            <AgGridReact
                columnDefs={columns}
                rowData={cars}>
            </AgGridReact>
        </div>
    );
}