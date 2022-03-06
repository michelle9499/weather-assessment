import 'bootstrap/dist/css/bootstrap.min.css';
import './weather.style.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { FaSearch } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';


const WeatherComponent = props => {
    function error() {
        return (
            <div className='alert alert-danger' role='alert'>{props.errorMessage}</div>
        );
    }

    return (
        <div className='container'>
            <h1 className='my-4'>Today's Weather</h1>
            <hr />
            <form onSubmit={(e) => props.loadWeather(e, null, null)} className='mb-4'>
                <div className='row'>
                    <div className='col-md-3 mb-sm-2'>
                        <input type="text" className='form-control' placeholder='City' name='city' autoComplete='off' />
                    </div>
                    <div className='col-md-3 mb-sm-2'>
                        <input type="text" className='form-control' placeholder='Country' name='country' autoComplete='off' />
                    </div>
                    <div className='btn-toolbar col-md-6 mb-sm-2'>
                        <Button type='submit' variant='primary' className='btn mx-1 no-outline'>Search</Button>
                        <Button type='reset' variant='outline-secondary' className='btn mx-1 no-outline' defaultValue="Reset">Clear</Button>
                    </div>
                    <div className='col-12'>{props.error ? error() : null}</div>
                </div>
            </form>
            {props.city && props.country ? (
                <Card className='mb-4 w-18rem w-sm-100'>
                    <Card.Body>
                        <p className='text-secondary mb-0'>{props.city}, {props.country}</p>
                        <h2>{props.main}</h2>
                        <p className='text-secondary mb-0'>Description: <span className='text-dark'>{props.description}</span></p>
                        <p className='text-secondary mb-0'>Temperature: <span className='text-dark'>{props.tempMin}&deg;C ~ {props.tempMax}&deg;C</span></p>
                        <p className='text-secondary mb-0'>Humidity: <span className='text-dark'>{props.humidity}%</span></p>
                        <p className='text-secondary mb-0'>Time: <span className='text-dark'>{props.time}</span></p>
                    </Card.Body>
                </Card>
            ) : null}
            <h3>Search History</h3>
            <hr />
            <Table responsive>
                <tbody>
                    {props.recent.map((r, i) => (
                        <tr key={i}>
                            <td width='5%'>{i + 1}.</td>
                            <td width='75%' className='td-block'>{r.city}, {r.country}</td>
                            <td width='10%' className='td-block'>{r.time}</td>
                            <td width='10%'>
                                <Button type='submit' className='btn-rounded-light mx-1' onClick={(e) => props.loadWeather(e, r.city, r.country)}><FaSearch /></Button>
                                <Button type='submit' className='btn-rounded-light mx-1' onClick={() => props.removeHistory(i)}><FaTrashAlt /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {props.recent.length <= 0 ? (<div>Not found</div>) : null}
        </div>
    )
}

export default WeatherComponent;