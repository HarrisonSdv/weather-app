import React from 'react';
import {Pagination} from 'react-bootstrap'
import './Head.css';
import './Search.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Closer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            latitude:{},
            longitude:{},
            data: false,
            id: this.props.match.params.id
        };

        //Variables
        this.Hi = ""
        this.Lo = ""
        this.Sunup = ""
        this.Sundown = ""
        this.Clouds = ""
        this.Humid = ""
        this.Pressure = ""
        this.Wind = ""
        this.Geo = ""
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
        this.searchID = this.props.match.params.id;
        this.active = 0;

        //Function
        this.componentDidMount = this.componentDidMount.bind(this);
        this.Search = this.Search.bind(this);
        this.logout = this.logout.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.dataHandle = this.dataHandle.bind(this);
        this.detail = this.detail.bind(this);
        this.closeSearch = this.closeSearch.bind(this);
    }

    logout(e){
        this.props.history.push("/")
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

    closeSearch(){
        fetch("http://api.openweathermap.org/data/2.5/weather?id=" + this.searchID + "&units=metric&cnt=50&appid=f92532d2ff19c48882865e592e1b6779")
        .then(response => response.json())
        .then(result =>{
            console.log(result);
            if(result.cod === '400'){
                this.props.history.push('/error')
            } else{
                this.searchlocation = [];
            this.flag = [];
            this.wSymbol = [];
            this.description = [];
            this.main = [];

            var city = result.name;
            var country = result.sys.country;
            this.flag.push("http://openweathermap.org/images/flags/" + country.toLowerCase() + ".png")
            this.id.push(result.id)
            this.searchlocation.push(city + " " + country);

            var feel = result.main.feels_like;
            var desc = result.weather[0].description;
            var wind = result.wind.speed;
            this.description.push("Feels like: " + feel + ", " + desc + ", wind speed: " + wind + "m/s")

            var icon = result.weather[0].icon;
            this.wSymbol.push("http://openweathermap.org/img/wn/"+ icon +"@2x.png")
            var temp = result.main.temp;
            this.main.push(temp + " ° c");

            this.Hi = result.main.temp_max+"°c";
            this.Lo = result.main.temp_min+"°c";
            this.Sunup = new Date(result.sys.sunrise).toLocaleTimeString();
            this.Sundown = new Date(result.sys.sunset).toLocaleTimeString();
            this.Clouds = result.sys.description;
            this.Humid = result.main.humidity + "%";
            this.Pressure = result.main.pressure + " hPa";
            this.Wind = result.wind.speed + "m/s, moving to the direction " + result.wind.deg + "°";
            this.Geo =  result.coord.lat +", " + result.coord.lon;
            }
        })
        .then(result =>{
            this.setState({data:true})
        })
    }





    componentDidMount(){
        this.closeSearch();
    }

    detail(num){
        this.props.history.push("/Loading");
        setTimeout(()=>{this.props.history.push("/search/" + num);},50);
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

                <div id = "body">

                    <div class="data" id="c">

                        <h2>
                            <img src={this.flag[0]} alt="flag"/>
                            {this.searchlocation[0]}
                        </h2>

                        {this.description[0]}

                        <h1>
                            <img src={this.wSymbol[0]} alt="weather"/>
                            {this.main[0]}
                        </h1>
                        <div id="a">
                            Expect Weather from {this.Hi} to {this.Lo}
                        </div>

                        <div id="b">
                            Sunrise: {this.Sunup} Sunset: {this.Sundown}
                        </div>

                        <div id="a">
                            Clouds: {this.Clouds} Humidity: {this.Humid} Pressure: {this.Pressure}
                        </div>

                        <div id="b">
                            Wind: {this.Wind}  
                        </div>

                        <div id="a">
                            Geo Location: {this.Geo}   
                        </div>
                    </div>

                    
                </div>

            </div>          
            
        )
    }
}
export default Closer;

