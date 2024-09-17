use std::string;

use crate::excel;
use serenity::async_trait;
use serenity::model::channel::Message;
use serenity::all::{CreateMessage, CreateEmbed};
use serenity::model::gateway::Ready;
use serenity::prelude::*;

struct Handler;

fn add_plus(score: f64) -> String {
    let mut signed_score = score.to_string();

    if score > 0.0 {
        signed_score = format!("+{}", score);
    }

    signed_score
}

#[async_trait]
impl EventHandler for Handler {
    async fn message(&self, ctx: Context, msg: Message) {
        let content: &str = &msg.content;
        let excel_data = excel::read_excel();
        //print!("reload data!");
        match content {
            "score" | "得点" | "てん" | "点" | "0" | "０" => {
                let score1 = excel_data.score[0].to_string();
                let score2 = excel_data.score[1].to_string();
                let score3 = excel_data.score[2].to_string();
                let score4 = excel_data.score[3].to_string();
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .content(excel_data.kyoku_num)
                        .embed(
                            CreateEmbed::new()
                                .color(0xFFFFFF)
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
                let diff1_2 = excel_data.score[1] - my_score;
                let diff1_3 = excel_data.score[2] - my_score;
                let diff1_4 = excel_data.score[3] - my_score;
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .embed(
                            CreateEmbed::new()
                                .color(0x0000FF)
                                .title("player1の得点")
                                .field("得点", my_score.to_string(), false)
                                .field("p2との差", add_plus(diff1_2), true)
                                .field("p3との差", add_plus(diff1_3), true)
                                .field("p4との差", add_plus(diff1_4), true)
                        )
                ).await {
                    println!("Error sending message: {:?}", why);
                }
            }
            "player2" | "p2" | "2" | "２" => {
                let my_score = excel_data.score[1];
                let diff2_1 = excel_data.score[0] - my_score;
                let diff2_3 = excel_data.score[2] - my_score;
                let diff2_4 = excel_data.score[3] - my_score;
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .embed(
                            CreateEmbed::new()
                                .color(0xDC143C)
                                .title("player2の得点")
                                .field("得点", my_score.to_string(), true)
                                .field("p1との差", add_plus(diff2_1), false)
                                .field("p3との差", add_plus(diff2_3), false)
                                .field("p4との差", add_plus(diff2_4), false)
                        )
                ).await {
                    println!("Error sending message: {:?}", why);
                }
            }
            "player3" | "p3" | "3" | "３" => {
                let my_score = excel_data.score[2];
                let diff3_1 = excel_data.score[0] - my_score;
                let diff3_2 = excel_data.score[1] - my_score;
                let diff3_4 = excel_data.score[3] - my_score;
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .embed(
                            CreateEmbed::new()
                                .color(0x008000)
                                .title("player3の得点")
                                .field("得点", my_score.to_string(), true)
                                .field("p1との差", add_plus(diff3_1), false)
                                .field("p2との差", add_plus(diff3_2), false)
                                .field("p4との差", add_plus(diff3_4), false)
                        )
                ).await {
                    println!("Error sending message: {:?}", why);
                }
            }
            "player4" | "p4" | "4" | "４" => {
                let my_score = excel_data.score[3];
                let diff4_1 = excel_data.score[0] - my_score;
                let diff4_2 = excel_data.score[1] - my_score;
                let diff4_3 = excel_data.score[2] - my_score;
                if let Err(why) = msg.channel_id.send_message(&ctx.http,
                    CreateMessage::new()
                        .embed(
                            CreateEmbed::new()
                                .color(0xFFFF00)
                                .title("player4の得点")
                                .field("得点", my_score.to_string(), true)
                                .field("p1との差", add_plus(diff4_1), false)
                                .field("p2との差", add_plus(diff4_2), false)
                                .field("p3との差", add_plus(diff4_3), false)
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
