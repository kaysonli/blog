function FindProxyForURL(url,host){
    if((isPlainHostName(host))||shExpMatch(url,"http://127.0.0.1/*")||isInNet(host,"192.168.0.0", "255.255.255.0")){
        return "direct";
    } else {
    　　return "PROXY 192.168.1.103:8888";
    }
}