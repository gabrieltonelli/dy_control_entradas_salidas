async function testApi() {
    try {
        const response = await fetch('http://localhost:5000/api/porteria/pendientes?email=gabrielt@donyeyo.com.ar');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error hitting local API:', err.message);
    }
}

testApi();
