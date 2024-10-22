
import Spline from '@splinetool/react-spline'; 
import Sidebar from './Sidebar';
import Body from './Body';
import Footer from './footer';

function Home() {

  return (
  <div className='flex flex-row'>
    <div>
    {/* <Sidebar></Sidebar> */}
    </div>
    <div>
    <h1 className='text-xl lg:text-3xl text-center border-b-2  pb-4 -mt-6 font-semibold  text-gray-800' >Bridging Technology and Community for Safer Futures.</h1>
    <div className='h-svh w-svw'>
     
    <Spline className='rounded-lg lg:rounded-full '
        scene="https://prod.spline.design/xPbYKlpBPLyvSEMH/scene.splinecode" 
      />
         </div>
         <Body></Body>
         <Footer></Footer>

    </div>
   
  </div>
  );
}

export default Home;
