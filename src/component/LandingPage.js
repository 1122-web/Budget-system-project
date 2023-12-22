import React from 'react'
import { Card,Button, Row,Col} from 'antd';


import budget from '../images/budget.jpg';
import {Link} from 'react-router-dom';

const LandingPage = () => {

//   return (
//     <div>
// <nav className='navbar'>
//   <div className='left-div'><h1>Budget Tracker </h1></div>
//     <div className='right-div'> 
   
//        <Link to="/SignIn"><Button className='Button'>SIGNIN</Button></Link>

//     <Link to="/SignUp"><Button className='Button'>SIGNUP</Button></Link>
//     </div>
//   </nav>


//   <div className='content'>
//   <Card className='responsive-card'
//     style={{
//       width: 500,
//       border: 'none'
//     }}
//   >
//     <h1 className='heading'>WellCome to Budget Tracker</h1>
//       <p>Welcome to our budget tracking system, your go-to platform for managing and analyzing your 
//         finances seamlessly. Stay in control of your expenses, income, and savings with our user-friendly interface. Effortlessly track your financial journey, set goals,
//          and make informed decisions to achieve your financial objectives.</p>
         
//   </Card>

//   <Card 
//     className='responsive-card'
//     hoverable
//     style={{
//       width: 280, // Set the initial width
//       border: 'none',
//       height: '13em',
//       marginTop: '3em',
    
//     }}
//     cover={
//       <img
//         alt="example"
//         src={budget}
//         className="responsive-image"
//         style={{
//           borderRadius: '5%',
//           width: '100%', // Set width to 100% to fill the container
//           height: '100%', // Set height to 100% to fill the container
//           objectFit: 'cover', // Ensure the image maintains its aspect ratio
          
//         }}
//       />
//     }
//   >
   
//   </Card>




//   </div>

//   <footer className='wavy-footer'>
  
//   <div className='footerdiv'
  
  
//   >
//      <h1 className='heading'>ABOUT US</h1>
//           <p > Effortlessly manage your finances with our intuitive budget tracking website.
//        Gain insights into your current income, monthly expenses, and savings, 
//       empowering you to make informed financial decisions. 
//       Take control of your financial well-being with our user-friendly platform</p>
   
//   </div>

// </footer>
//   </div>
return (
  <div>
    {/* <nav className='navbar'>
      <div className='left-div'>
        <h1>Budget Tracker</h1>
      </div>
      <div className='right-div'>
        <Link to="/SignIn"><Button className='Button'>SIGNIN</Button></Link>
        <Link to="/SignUp"><Button className='Button'>SIGNUP</Button></Link>
      </div>
    </nav> */}
{/* 
  <nav class="navbar" >
    <div class="row">
      <div class="col-sm-12 col-md-6"  className='left-div'>
        <h1>Budget Tracker</h1>
      </div>
      <div class="col-sm-12 col-md-6 text-right" className='right-div'>
        <Link to="/SignIn"><Button className='Button'>SIGNIN</Button></Link>
        <Link to="/SignUp"><Button className='Button'>SIGNUP</Button></Link>
      </div>
    </div>
  </nav> */}
 <nav className='navbar'>
  <div class="col-sm-12 col-md-6" style={{margin:'15px', color:'#13c2c2'}}><h1>Budget Tracker </h1></div>
   <div  class="col-sm-12 col-md-6 text-right" style={{margin:'15px'}}> 
   
      <Link to="/SignIn"><Button className='Button'>SIGNIN</Button></Link>

  <Link to="/SignUp"><Button className='Button'>SIGNUP</Button></Link>
   </div>
  </nav>
    <div className='content'>
      <Row gutter={[16, 16]} justify="center">

        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
          <Card className='responsive-card'
            style={{
              border: 'none'
            }}
          >
            <h2 className='heading'>Welcome to Budget Tracker</h2>
            <p>
              Welcome to our budget tracking system, your go-to platform for managing and analyzing your
              finances seamlessly. Stay in control of your expenses, income, and savings with our user-friendly interface. Effortlessly track your financial journey, set goals,
              and make informed decisions to achieve your financial objectives.
            </p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
          <Card
            className='responsive-card'
            
            style={{
              border: 'none',
              height: '13em',
              marginTop: '3em',
             
            }}
            cover={
              <img
                alt="example"
                src={budget}
                className="responsive-image"
                style={{
                  borderRadius: '5%',
                  width: '60%',
                  height: '60%',
                  objectFit: 'cover',
                }}
              />
            }
          />
        </Col>

      </Row>
    </div>
    <footer className='wavy-footer'>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={12} lg={12} xl={8}>
           
            <Card className='Footerdiv'
            style={{
              border: 'none',
              background:' #e6fffb',
            }}
          >
            <h2 className='heading1'>ABOUT US</h2>
            <p>
            Effortlessly manage your finances with our intuitive budget tracking website.
                Gain insights into your current income, monthly expenses, and savings,
                empowering you to make informed financial decisions.
                Take control of your financial well-being with our user-friendly platform.
            </p>
          </Card>
          </Col>
        </Row>
      </footer>
    </div>
);
}
















      
 


export default LandingPage
