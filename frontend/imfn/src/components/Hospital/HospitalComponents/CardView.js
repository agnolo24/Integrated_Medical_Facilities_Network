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

function CardView({ name,image, link }) {
    return (
        <div className="single-team mb-30 shadow-sm" style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
            <a href={link}>
                <div className="team-thumb" style={{ position: 'relative' }}>
                <div className="brd">
                    <img 
                        src={image || require('../../../asset/user_assets/img/team/team01.png')} 
                        alt="doctor" 
                        className="img-fluid w-100"
                    />
                </div>
            </div>
            
            <div className="team-info p-4 text-center">
                <h4 className="mb-1">
                    {name}
                </h4>
            </div>
            </a>
        </div>
    );
}

export default CardView
