import { useRouter } from "next/router";

export default function Home() {
  const {asPath} = useRouter();
  if(asPath=='homepage'){
    body.style.background='#4B0082'
  }
  return (
    <>
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
            <img src="/assets/img2.webp" alt="KBC Host" style={{width:'500px'}}/>
        </div>
    </div>
        </div>
    </>
  )
}
