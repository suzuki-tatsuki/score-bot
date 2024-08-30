use serenity::async_trait;
use serenity::model::channel::Message;
use serenity::all::{CreateMessage, CreateEmbed};
use serenity::model::gateway::Ready;
use serenity::prelude::*;

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn message(&self, ctx: Context, msg: Message) {
        let content: &str = &msg.content;
        match content {
            "!score" => {
                let score1 = "25000";
                let score2 = "25000";
                let score3 = "25000";
                let score4 = "25000";
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .embed(
                            CreateEmbed::new()
                                .color(0x00FF00)
                                .title("得点一覧")
                                .field("player1", score1, false)
                                .field("player2", score2, false)
                                .field("player3", score3, false)
                                .field("player4", score4, false)
                        )
                ).await {
                    println!("Error sending message: {:?}", why);
                }
            }
            "!player1" | "!p1" => {
                let my_score = "25000";
                let diff1_2 = my_score.parse::<i32>().expect("Not a valid number") - 25000;
                let diff1_3 = my_score.parse::<i32>().expect("Not a valid number") - 25000;
                let diff1_4 = my_score.parse::<i32>().expect("Not a valid number") - 25000;
                let rank = "1位";
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .embed(
                            CreateEmbed::new()
                                .color(0x0000FF)
                                .title("player1の得点")
                                .field("得点", my_score, true)
                                .field("順位", rank, true)
                                .field("player2との差", diff1_2.to_string(), false)
                                .field("player3との差", diff1_3.to_string(), false)
                                .field("player4との差", diff1_4.to_string(), false)
                        )
                ).await {
                    println!("Error sending message: {:?}", why);
                }
            }
            &_ => todo!() // すべての他のケースをカバー
        }
    }

    async fn ready(&self, _: Context, ready: Ready) {
        println!("{} is connected!", ready.user.name);
    }
}

pub async fn send(token: &str) {
    let mut client = Client::builder(&token, GatewayIntents::all())
        .event_handler(Handler)
        .await
        .expect("Error creating client");

    if let Err(why) = client.start().await {
        println!("Client error: {:?}", why);
    }
}
