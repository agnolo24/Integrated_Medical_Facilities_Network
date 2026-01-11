import React, { useEffect } from 'react';
import { NavLink } from 'react-router';

// CSS Imports
import '../../../asset/user_assets/css/bootstrap.min.css';
import '../../../asset/user_assets/css/animate.min.css';
import '../../../asset/user_assets/css/magnific-popup.css';
import '../../../asset/user_assets/fontawesome/css/all.min.css';
import '../../../asset/user_assets/css/dripicons.css';
import '../../../asset/user_assets/css/slick.css';
import '../../../asset/user_assets/css/default.css';
import '../../../asset/user_assets/css/meanmenu.css';
import '../../../asset/user_assets/css/style.css';
import '../../../asset/user_assets/css/responsive.css';

function CardView({ name, specialty, experience, image }) {
    return (
        <div className="single-team mb-30 shadow-sm" style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
            <div className="team-thumb" style={{ position: 'relative' }}>
                <div className="brd">
                    <img 
                        src={image || require('../../../asset/user_assets/img/team/team01.png')} 
                        alt="doctor" 
                        className="img-fluid w-100"
                    />
                </div>

                {/* The "+" Button logic */}
                <div className="dropdown">
                    <button className="xbtn border-0" type="button" data-bs-toggle="dropdown" style={{ cursor: 'pointer' }}>
                        +
                    </button>
                    <div className="dropdown-menu shadow border-0">
                        <div className="team-social d-flex justify-content-around p-2">
                             <a href="#"><i className="fab fa-facebook-f"></i></a>
                             <a href="#"><i className="fab fa-twitter"></i></a>
                             <a href="#"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="team-info p-4 text-center">
                <h4 className="mb-1">
                    <a href="#" style={{ fontSize: '20px', whiteSpace: 'nowrap' }}>{name}</a>
                </h4>
                <span className="text-primary d-block mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                    {specialty}
                </span>
                <p className="text-muted small">{experience}</p>
            </div>
        </div>
    );
}

export default CardView
