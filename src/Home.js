import React from 'react';
import {Pagination} from 'react-bootstrap'
import './Head.css';
import './Home.css';
import './Search.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            latitude:{},
            longitude:{},
            data: false,
        };

        //Variables
        this.active = 0;
        this.time = "";
        this.location = "";
        this.maintemp = "";
        this.weather = "";
        this.HiLo = "";
        this.amount = 0;
        this.page = [];
        this.searchlocation = [];
        this.flag = [];
        this.wSymbol = [];
        this.main = [];
        this.memory = [];
        this.output = [];
        this.id = [];
        this.description = [];

        //Function
        this.componentDidMount = this.componentDidMount.bind(this);
        this.showPosition = this.showPosition.bind(this);
        this.Search1 = this.Search1.bind(this);
        this.getCurrentDate = this.getCurrentDate.bind(this);
        this.Search = this.Search.bind(this);
        this.logout = this.logout.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.dataHandle = this.dataHandle.bind(this);
        this.detail = this.detail.bind(this);
    }

    Search1(lat, lon){
        fetch("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=f92532d2ff19c48882865e592e1b6779")
        .then(response => response.json())
        .then(
            (result) =>{

                var city = result.name;
                var country = result.sys.country;
                this.location = city + ", " + country;
                this.maintemp = result.main.temp + "°c"
                this.weather = result.weather[0].description;
                var high = result.main.temp_max;
                var low = result.main.temp_min;
                this.HiLo = high + "°c / " + low + "­°c"
                this.setState({
                    data: true
                })
            }

        )
    }

    getCurrentDate(){
        var dayname = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var monthname = ["January", "February", "March", "April", "May", "June", "July", "August", 
                        "September", "October", "November", "December"];
        var day = new Date().getDay();
        var date = new Date().getDate();
        var month = new Date().getMonth();
        var year = new Date().getFullYear();
        var value = dayname[day] + ", " + date + " " + monthname[month] + " " + year;
        this.time = value;
    }

    logout(e){
        document.getElementById("body2").style.display = "none";
        document.getElementById("body").style.display = "block";
    }

    Search(test){
        test.preventDefault();
        if(test.target.elements.citysearch.value !== ""){
            var search = test.target.elements.citysearch.value;
        fetch("http://api.openweathermap.org/data/2.5/find?q=" + search + "&units=metric&cnt=50&appid=f92532d2ff19c48882865e592e1b6779")
        .then(response => response.json())
        .then(result =>{

            this.amount = result.count;
            if(result.count === 0){
                document.getElementById("error").style.visibility = "visible";
            } else{
                this.searchlocation = [];
                this.flag = [];
                this.wSymbol = [];
                this.description = [];
                this.main = [];

                for(var i = 0; i < result.count; i++){
                    var city = result.list[i].name;
                    var country = result.list[i].sys.country;
                    this.flag.push("http://openweathermap.org/images/flags/" + country.toLowerCase() + ".png")
                    this.id.push(result.list[i].id)
                    this.searchlocation.push(city + " " + country);

                    var feel = result.list[i].main.feels_like;
                    var desc = result.list[i].weather[0].description;
                    var wind = result.list[i].wind.speed;
                    this.description.push("Feels like: " + feel + ", " + desc + ", wind speed: " + wind + "m/s")

                    var icon = result.list[i].weather[0].icon;
                    this.wSymbol.push("http://openweathermap.org/img/wn/"+ icon +"@2x.png")
                    var temp = result.list[i].main.temp;
                    this.main.push(temp + " ° c");
                    //result.list[i]
                }
                this.dynamicPage(result.count)
                document.getElementById("error").style.visibility = "hidden";
                document.getElementById("body").style.display = "none";
                document.getElementById("body2").style.display = "block";
                this.active = 0
            }

        }).then(result =>{
            this.setState({
                data:true
            })
        })
        } else{
            document.getElementById("error").style.visibility = "visible";
        }
    }
    
    dataHandle(){

        var dataleft = (this.amount - (this.active * 3))

            if(dataleft === 2){
                document.getElementById(2).style.display = "none";
            } else if(dataleft === 1){
                document.getElementById(1).style.display = "none";
                document.getElementById(2).style.display = "none";
            } else{
                document.getElementById("0").style.display = "block";
                document.getElementById("1").style.display = "block";
                document.getElementById("2").style.display = "block";
            }
        this.setState({data:true})
        
    }

    pageChange(event){

        this.active = event.target.text - 1

        this.dataHandle();
    }

    dynamicPage(num){
        this.page = [];
        var pageAmount = parseInt(num/3) + 1;

        if(pageAmount !== 1){
            for(var i = 0; i < pageAmount; i++){
                this.page.push(
                    <Pagination.Item 
                    key={i} 
                    onClick={(event) => this.pageChange(event)}>
                        {i + 1}
                    </Pagination.Item>
                    );
            }
        } 
        this.dataHandle();
        this.active = 0;
    }

    showPosition(position){
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            });
        this.Search1(this.state.latitude, this.state.longitude);
    }

    componentDidMount(){
        this.getCurrentDate();
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.showPosition);
        } else{
            alert("Cannot get current geolocation");
        }
    }

    detail(num){
        this.props.history.push("/search/" + num)
    }

    render(){
        if(!this.state.data){
            return <div />
        }

        return(      
            <div>
                <div id = "head">
                
                <form method="post" onSubmit={(event) => this.Search(event)}>
                    <input type="button" onClick={this.logout} value = "Home" />
                    <input type="text" name="citysearch" />
                    <input type="submit" value="Search" />
                </form>
                <p id="error">The city does not exist.</p>
                </div>

                <div id = "body">
                    <h2 id = "location" >{this.location}</h2>
                    <h2 id = "time">{this.time}</h2>
                    <h1 id = "temp" >{this.maintemp}</h1>
                    <h2 id = "weather">{this.weather}</h2>
                    <h2 id = "HiLo">{this.HiLo}</h2>
                </div>

                <div id="body2">
                    <Pagination>
                        {this.page}
                    </Pagination>

                    <div class="data" id="0">

                        <h2>
                            <img src={this.flag[this.active * 3]} alt="flag"/>
                            {this.searchlocation[this.active * 3]}
                        </h2>

                        {this.description[this.active * 3]}

                        <h1>
                            <img src={this.wSymbol[this.active * 3]} alt="weather"/>
                            {this.main[this.active * 3]}
                        </h1>

                        <img id= "arrow" src={process.env.PUBLIC_URL + '/DownArrow.png'} alt="logo" onClick={(event) => this.detail(this.id[this.active * 3])}/>
                    </div>

                    <div class="data" id="1">

                        <h2>
                            <img src= {this.flag[this.active * 3 + 1]} alt="flag" />
                            {this.searchlocation[this.active * 3 + 1]}
                        </h2>

                        {this.description[this.active * 3 + 1]}

                        <h1>
                            <img src={this.wSymbol[this.active * 3 + 1]} alt="Weather"/>
                            {this.main[this.active * 3 + 1]}
                        </h1>

                        <img id = "arrow" src={process.env.PUBLIC_URL + '/DownArrow.png'} alt="logo" onClick={(event) => this.detail(this.id[this.active * 3 + 1])}/>
                    </div>

                    <div class="data" id="2">
                        <h2>
                            <img src={this.flag[this.active * 3 + 2]} alt="flag" />
                            {this.searchlocation[this.active * 3 + 2]}
                        </h2>
                        
                        {this.description[this.active * 3 + 2]}

                        <h1>
                            <img src={this.wSymbol[this.active * 3 + 2]} alt="weather" />
                            {this.main[this.active * 3 + 2]}
                        </h1>
                        
                        <img id="arrow" src={process.env.PUBLIC_URL + '/DownArrow.png'} alt="logo" onClick={(event) => this.detail(this.id[this.active * 3 + 2])}/>
                    </div>

            </div>

            </div>          
            
        )
    }
}
export default Home;