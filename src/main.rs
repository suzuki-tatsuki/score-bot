use dotenvy::dotenv;
use std::env;

fn main() {
    dotenv().expect(".env file not loaded");
    let discord_token = env::var("DISCORD_TOKEN").expect("discord_token not found");
}
