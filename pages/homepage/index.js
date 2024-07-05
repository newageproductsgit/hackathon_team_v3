import React from 'react';

function index(props) {
    return (
        <div>
           <div class="container">
            <div className='main-head'>
            <img src='/assets/logo.png' style={{width:"80px",borderRadius:'60%'}}/>
            <h1 style={{textTransform: "uppercase"}}>Kaun Banega Crorepati</h1>
            </div>
        <div class="info-box">
            <p>Start Here</p>
            <div className='cta-container'>
              <button>Create Room</button>
              <button>Join Room</button>
            </div>
        </div>
        
        <div class="image-container">
            <img src="/assets/img3.jpg" alt="KBC Host" style={{width:'500px'}}/>
        </div>
    </div>
        </div>
    );
}

export default index;