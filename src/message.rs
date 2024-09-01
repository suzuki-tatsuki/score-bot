use crate::excel;

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
        let excel_data = excel::read_excel();
        match content {
            "score" => {
                let score1 = excel_data.score[0].to_string();
                let score2 = excel_data.score[1].to_string();
                let score3 = excel_data.score[2].to_string();
                let score4 = excel_data.score[3].to_string();
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .content(excel_data.kyoku_num)
                        .embed(
                            CreateEmbed::new()
                                .color(0x000000)
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
            "player1" | "p1" | "1" | "１" => {
                let my_score = excel_data.score[0];
                let diff1_2 = my_score - excel_data.score[1];
                let diff1_3 = my_score - excel_data.score[2];
                let diff1_4 = my_score - excel_data.score[3];
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .embed(
                            CreateEmbed::new()
                                .color(0x0000FF)
                                .title("player1の得点")
                                .field("得点", my_score.to_string(), true)
                                .field("player2との差", diff1_2.to_string(), false)
                                .field("player3との差", diff1_3.to_string(), false)
                                .field("player4との差", diff1_4.to_string(), false)
                        )
                ).await {
                    println!("Error sending message: {:?}", why);
                }
            }
            "player2" | "p2" | "2" | "２" => {
                let my_score = excel_data.score[0];
                let diff1_2 = my_score - excel_data.score[1];
                let diff1_3 = my_score - excel_data.score[2];
                let diff1_4 = my_score - excel_data.score[3];
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .embed(
                            CreateEmbed::new()
                                .color(0x0000FF)
                                .title("player1の得点")
                                .field("得点", my_score.to_string(), true)
                                .field("player2との差", diff1_2.to_string(), false)
                                .field("player3との差", diff1_3.to_string(), false)
                                .field("player4との差", diff1_4.to_string(), false)
                        )
                ).await {
                    println!("Error sending message: {:?}", why);
                }
            }
            "player3" | "p3" | "3" | "３" => {
                let my_score = excel_data.score[0];
                let diff1_2 = my_score - excel_data.score[1];
                let diff1_3 = my_score - excel_data.score[2];
                let diff1_4 = my_score - excel_data.score[3];
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .embed(
                            CreateEmbed::new()
                                .color(0x0000FF)
                                .title("player1の得点")
                                .field("得点", my_score.to_string(), true)
                                .field("player2との差", diff1_2.to_string(), false)
                                .field("player3との差", diff1_3.to_string(), false)
                                .field("player4との差", diff1_4.to_string(), false)
                        )
                ).await {
                    println!("Error sending message: {:?}", why);
                }
            }
            "player4" | "p4" | "4" | "４" => {
                let my_score = excel_data.score[0];
                let diff1_2 = my_score - excel_data.score[1];
                let diff1_3 = my_score - excel_data.score[2];
                let diff1_4 = my_score - excel_data.score[3];
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .embed(
                            CreateEmbed::new()
                                .color(0x0000FF)
                                .title("player1の得点")
                                .field("得点", my_score.to_string(), true)
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
